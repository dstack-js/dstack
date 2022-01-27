import type { IPFS } from "ipfs-core"
import type { libp2p as Libp2p } from "ipfs-core/src/components/network"
import { PubSub } from "./pubsub"
import { Store } from "./store"

export interface Peer {
  id: string
  address: string
}

export class Stack {
  public store: Store
  public pubsub: PubSub

  private constructor(public namespace: string, public ipfs: IPFS, public id: string) {
    this.pubsub = new PubSub(ipfs, namespace)
    this.store = new Store(ipfs, namespace, this.pubsub)
  }

  private get libp2p() {
    return (this.ipfs as any).libp2p as Libp2p
  }

  /**
   * Create stack
   *
   * @param namespace needed to scope different stacks data/events
   * @param ipfs IPFS instance / see `@dstack-js/ipfs` package
   * @returns Stack instance
   */
  public static async create(namespace: string, ipfs: IPFS) {
    const { id } = await ipfs.id()
    const stack = new Stack(namespace, ipfs, id)

    await stack.store.start()
    return stack
  }

  /**
   * Get connected peers
   *
   * @returns connected peers list
   */
  public async peers(): Promise<Peer[]> {
    const peers = await this.ipfs.swarm.peers()

    return peers.map(({ peer, addr }) => ({
      id: peer,
      address: addr.toString()
    }))
  }

  /**
   * Connect to peer
   *
   * By default IPFS will connect to some peers automatically, no need to use it without a reason
   *
   * @param address MultiAddr to connect
   */
  public async connect(address: string): Promise<void> {
    await this.ipfs.swarm.connect(address)
  }

  /**
   * Listen on new peer connected
   *
   * @param listener Will be called with peer info
   */
  public onPeerConnect(listener: (peer: Peer) => void): void {
    this.libp2p.addressManager.on('peer:connect', (event) => {
      listener({
        id: event.remotePeer.toB58String(),
        address: event.remoteAddr.toString()
      })
    })
  }

  /**
   * Start logging debug events
   */
  public debug(): void {
    this.onPeerConnect((peer) => console.log('New peer connected', peer.id, peer.address))
  }
}
