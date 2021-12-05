import { IGunChainReference } from 'gun/types/chain'

export class Node<T = unknown> {
  public ref: IGunChainReference

  constructor(public path: string, public gun: IGunChainReference) {
    const p = path.split('.')
    this.ref = p.reduce<IGunChainReference>(
      (previous, key) => previous.get(key),
      gun
    )
  }

  private encode(data: any): any {
    if (!data || typeof data !== 'object') return data

    return Object.keys(data).reduce<Record<string, any>>(
      (obj, key) => {
        if (Array.isArray(data[key])) {
          obj[`[]${key}`] = JSON.stringify(data[key])
        }
        return obj
      },
      {}
    )
  }

  private decode(data: any): any {
    if (!data || typeof data !== 'object') return data

    return Object.keys(data).reduce<Record<string, any>>(
      (obj, key) => {
        if (key.startsWith('[]')) {
          obj[key.slice(2)] = JSON.parse(data[key])
        }
        return obj
      },
      {}
    )
  }

  public get parent(): Node | null {
    const p = this.path.split('.')
    const path = p.slice(0, p.length - 1).join('.')
    console.log(p, path)
    return new Node(path, this.gun)
  }

  public async set(value: T, anonymous = false): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ref.put({ $data: this.encode(value) }, ({ err, ok }) => {
        if (err !== undefined) return reject(err)
        resolve(ok)
      })
    })
  }

  public on(listener: (data: T) => void): void {
    this.ref.on((value) => {
      if (value.$data !== undefined) {
        listener(this.decode(value.$data))
      }
    })
  }

  public get(timeout?: number): Promise<T | null> {
    return new Promise((resolve, reject) => {
      let timeoutInstance: ReturnType<typeof setTimeout> | undefined

      if (timeout) {
        timeoutInstance = setTimeout(() => reject(new Error(`get ${this.path} timeout`)), timeout)
      }

      this.ref.once((value: any) => {
        if (!value) return resolve(null)

        if (value.$data) {
          if (timeoutInstance) {
            clearTimeout(timeoutInstance)
          }

          resolve(this.decode(value.$data))
        }
      }, timeout ? { wait: timeout } : undefined)
    })
  }
}
