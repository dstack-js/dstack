import Gun from 'gun'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import 'gun/sea'
import 'gun/lib/then.js'

import { IGunChainReference } from 'gun/types/chain'
export interface StackOptions {
  peers?: string[]
  app: string
}

export interface StackContext {
  gun: IGunChainReference<any, any, any>
  app: string
}

export interface Node<T = any> {
  data?: T,
  on: (listener: (data: T) => void) => void,
  path: string,
}

export interface Stack {
  node: <T = any>(path: string, put?: T) => Promise<Node<T>>,
  context: StackContext
}

export const getRootNode = async (context: StackContext): Promise<<T = any>(path: string, put?: T) => Promise<Node<T>>> => {
  const node = async <T = any>(path: string, put?: T) => {
    let chain = path.split('.')
      // eslint-disable-next-line unicorn/no-array-reduce
      .reduce<IGunChainReference<any, any, any>>(
        (previous, key) => previous.get(key),
        context.gun.get(context.app)
      )

    if (put) chain = chain.put(put)

    const data = await (chain.promise as any)().then()

    return {
      data: data.put as any as T,
      on: (listener: (data: T) => void) => {
        chain.on((data) => listener(data))
      },
      path,
      get: async (): Promise<T> => {
        return (chain.promise as any)().then()
      }
    }
  }

  return node
}

export const createStack = async ({ peers, app }: StackOptions): Promise<Stack> => {
  if (!peers) {
    peers = ['https://gun-server-0x77.herokuapp.com/gun']
  }

  const gun = Gun({
    peers
  })

  const context = {
    gun,
    app
  }

  return {
    node: await getRootNode(context),
    context
  }
}
