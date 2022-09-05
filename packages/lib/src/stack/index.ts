import { KV } from "../kv"
import { Network } from "../network"
import { PubSub } from "../pubsub"
import { StackOptions } from "./interfaces"

export class Stack {
  public kv: KV
  public pubsub: PubSub

  private constructor (
    public options: StackOptions,
    public network: Network
  ) {
    this.kv = KV.create(this)
    this.pubsub = new PubSub(this)
  }

  public static async start (options: StackOptions): Promise<Stack> {
    const network = await Network.create(options.network)

    return new Stack(options, network)
  }
}

export * from "./interfaces"
