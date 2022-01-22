import type { IPFS } from "ipfs-core"
import { Store } from "./store"

export class Stack {
  public store: Store

  private constructor(public name: string, ipfs: IPFS) {
    this.store = new Store(ipfs, name)
  }

  public static async create(name: string, ipfs: IPFS) {
    // TODO: check ipfs for DHT turned on
    return new Stack(name, ipfs)
  }
}
