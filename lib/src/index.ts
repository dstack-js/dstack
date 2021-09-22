import Gun from 'gun'
import { getNode, Node } from './node'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import 'gun/sea'
import 'gun/lib/then.js'

import { IGunChainReference } from 'gun/types/chain'

interface StackOptions {
  peers?: string[]
  app: string
}

interface StackContext {
  gun: IGunChainReference
  app: string
}

interface Stack {
  node: <T = any>(path: string, put?: T) => Promise<Node<T>>,
  context: StackContext
}

const createStack = async ({ peers, app }: StackOptions): Promise<Stack> => {
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
    node: await getNode(context),
    context
  }
}

export { createStack, Stack, StackOptions, StackContext, Node }
