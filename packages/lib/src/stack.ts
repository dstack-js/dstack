import { create, IPFS, Options } from 'ipfs-core'
import { readKey, readPrivateKey } from 'openpgp'
import { App, AppParameters } from './app'
import { Node } from './node'

export interface StackOptions {
  ipfsOptions?: Options
}

export class Stack {
  public publicKey: string
  private privateKey?: string

  constructor(
    private app: App,
    { publicKey, privateKey }: {publicKey: string, privateKey?: string},
    public ipfs: IPFS
  ) {
    this.publicKey = publicKey
    this.privateKey = privateKey
  }

  public static async create(parameters: AppParameters, keys: {publicKey: string, privateKey?: string}, { ipfsOptions }: StackOptions): Promise<Stack> {
    const ipfs = await create({
      EXPERIMENTAL: {
        ipnsPubsub: true,
        sharding: true
      },
      ...ipfsOptions
    })

    const cid = await ipfs.dag.put(parameters)

    const app: App = {
      cid,
      params: parameters,
      publicKey: await readKey({ armoredKey: keys.publicKey }),
      privateKey: keys.privateKey ? await readPrivateKey({ armoredKey: keys.privateKey }) : undefined
    }

    return new Stack(app, keys, ipfs)
  }

  public createNode(): Node {
    return new Node(this.ipfs, this.app)
  }
}
