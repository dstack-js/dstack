import { IGunChainReference } from 'gun/types/chain'
import { StackContext } from '.'

export interface NodeFile {
  /**
   * Mime-Type
   */
  type: string
  /**
   * Size in bytes
   */
  size: number
  /**
   * File content
   */
  file: number[]
}

export interface Node<T = any> {
  data?: T,
  on: (listener: (data: T) => void) => void,
  path: string,
  get: () => Promise<T>,
  file: () => Promise<NodeFile>,
  putFile: (file: NodeFile) => void
}

export const getNode = async (context: StackContext): Promise<<T = any>(path: string, put?: T) => Promise<Node<T>>> => {
  const node = async <T = any>(path: string, put?: T) => {
    let reference = path.split('.').reduce<IGunChainReference>(
      (previous, key) => previous.get(key),
      context.gun.get(context.app)
    )

    if (put) reference = reference.put(put)

    const data = await (reference.promise as any)().then()

    return {
      data: data.put as unknown as T,
      on: (listener: (data: T) => void) => {
        reference.on(
          (data) => listener(data as T)
        )
      },
      path,
      get: async (): Promise<T> => {
        const data = await (reference.promise as any)().then()
        return data.put
      },
      file: async (): Promise<NodeFile> => {
        const data = await ((reference.get('file').promise as any)().then() as Promise<NodeFile>)
        return data
      },
      putFile: (file: NodeFile) => {
        reference.get('file').put(file)
      }
    }
  }

  return node
}
