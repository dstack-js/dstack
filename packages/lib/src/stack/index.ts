import { KV } from "../kv"
import { Network } from "../network"
import { StackOptions } from "./interfaces"

export class Stack {
  private internalKV: KV

  constructor (
    public options: StackOptions = {},
    public network: Network
  ) {
    this.internalKV = KV.create(this)
  }

  public static async start (options: StackOptions): Promise<Stack> {
    const network = await Network.create(options.network)

    return new Stack(options, network)
  }
}

export * from "./interfaces"
