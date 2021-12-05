import Gun from 'gun'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import 'gun/sea'

import { IGunChainReference } from 'gun/types/chain'
import { IGunConstructorOptions } from 'gun/types/options'
import { defaults } from './defaults'
import { Node } from './node'

export interface StackOptions {
  app?: string
  gun?: IGunConstructorOptions
}

export class Stack {
  private gun: IGunChainReference

  constructor({ app, gun }: StackOptions) {
    if ((!app && !gun) || gun?.peers === defaults.gun.peers) {
      throw new Error('app must be specified when using public gun peers')
    }

    this.gun = Gun(gun || defaults.gun)

    if (app) {
      this.gun = this.gun.get(app)
    }
  }

  public node<T = unknown>(path: string): Node<T> {
    return new Node(path, this.gun)
  }
}
