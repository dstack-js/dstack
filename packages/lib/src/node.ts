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

  // TODO: Recursive execution
  private encode(data: any): any {
    if (!data || typeof data !== 'object') return data

    return Object.keys(data).reduce<Record<string, any>>(
      (object, key) => {
        if (Array.isArray(data[key])) {
          object[`[]${key}`] = JSON.stringify(data[key])
        }
        return object
      },
      {}
    )
  }

  // TODO: Recursive execution
  private decode(data: any): any {
    if (!data || typeof data !== 'object') return data

    return Object.keys(data).reduce<Record<string, any>>(
      (object, key) => {
        if (key.startsWith('[]')) {
          object[key.slice(2)] = JSON.parse(data[key])
        }
        return object
      },
      {}
    )
  }

  /**
   * Get parent node
   */
  public get parent(): Node | null {
    const path = this.path
      .split('.')
      .slice(0, -1)
      .join('.')

    const node = new Node(path, this.gun)

    if (node.path.length > 0) return node
    return null
  }

  /**
   * Set a value
   */
  public set(value: T): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ref.put({ $data: this.encode(value) }, ({ err, ok }) => {
        if (err !== undefined) return reject(err)
        resolve(ok)
      })
    })
  }

  /**
   * Get next nodes
   * `await stack.node('a.b').set({hello: 'world'})`
   * `await stack.node('a').next() -> [Node({path: 'a.b'})]`
   */
  public async next(): Promise<Node[]> {
    const keys: Set<string> = new Set()

    return new Promise((resolve) => {
      this.ref.map((value, key) => {
        if (!key.startsWith('$')) keys.add(key)
        return {}
      }).once(() => resolve([...keys].map(key => new Node(`${this.path}.${key}`, this.gun))))
    })
  }

  /**
   * Listen for node data changes
   * @param listener handler fo new data
   */
  public on(listener: (data: T) => void): void {
    this.ref.on((value) => {
      if (value.$data !== undefined) {
        listener(this.decode(value.$data))
      }
    })
  }

  /**
   * Get data from node
   * @param timeout timeout for data fetching, will return null after timeout
   */
  public get(timeout?: number): Promise<T | null> {
    return new Promise((resolve) => {
      let timeoutInstance: ReturnType<typeof setTimeout> | undefined

      if (timeout) {
        timeoutInstance = setTimeout(() => resolve(null), timeout)
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
