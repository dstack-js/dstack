import type { IPFS } from "ipfs-core"
import { PubSub } from "./pubsub"
import { Store } from "./store"

export class Stack {
  public store: Store
  public pubsub: PubSub

  private constructor(public name: string, ipfs: IPFS) {
    this.store = new Store(ipfs, name)
    this.pubsub = new PubSub(ipfs, name)
  }

  public static async create(name: string, ipfs: IPFS) {
    // TODO: check ipfs for DHT turned on
    return new Stack(name, ipfs)
  }
}
