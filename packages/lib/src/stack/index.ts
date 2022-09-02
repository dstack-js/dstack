import { KV } from "../kv"
import { Network } from "../network"
import { StackOptions } from "./interfaces"

export class Stack {
  public kv: KV

  private constructor (
    public options: StackOptions,
    public network: Network
  ) {
    this.kv = KV.create(this)
  }

  public static async start (options: StackOptions): Promise<Stack> {
    const network = await Network.create(options.network)

    return new Stack(options, network)
  }
}

export * from "./interfaces"
