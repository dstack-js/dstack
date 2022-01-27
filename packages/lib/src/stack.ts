import type { IPFS } from "ipfs-core"
import { PubSub } from "./pubsub"
import { Store } from "./store"

export class Stack {
  public store: Store
  public pubsub: PubSub

  private constructor(public namespace: string, ipfs: IPFS) {
    this.pubsub = new PubSub(ipfs, namespace)
    this.store = new Store(ipfs, namespace, this.pubsub)
  }

  public static async create(namespace: string, ipfs: IPFS) {
    const stack = new Stack(namespace, ipfs)

    await stack.store.start()
    return stack
  }
}
