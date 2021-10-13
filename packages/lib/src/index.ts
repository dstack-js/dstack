import Gun from 'gun'
import { getNode, Node } from './node'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import 'gun/sea'
import 'gun/lib/then.js'

import { IGunChainReference } from 'gun/types/chain'
import { IGunConstructorOptions } from 'gun/types/options'

interface StackOptions {
  peers?: string[]
  app: string
  gunOptions?: IGunConstructorOptions
}

interface StackContext {
  gun: IGunChainReference
  app: string
}

interface Stack {
  node: <T = any>(path: string, put?: T) => Promise<Node<T>>,
  context: StackContext
}

const createStack = async ({ peers, app, gunOptions }: StackOptions): Promise<Stack> => {
  if (!peers) {
    peers = ['https://gun-server-0x77.herokuapp.com/gun']
  }

  const gun = Gun({
    peers,
    ...gunOptions
  })

  const context = {
    gun,
    app
  }

  return {
    node: await getNode(context),
    context
  }
}

export { createStack, Stack, StackOptions, StackContext, Node }
