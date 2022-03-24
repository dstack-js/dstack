import type { IPFS } from 'ipfs-core-types'
import type { libp2p as Libp2p } from 'ipfs-core/src/components/network'
import all from 'it-all'
import type { CID } from 'ipfs-core'
import { PeerUnreachableError, Store } from '.'
import { PubSub } from './pubsub'
import { Storage } from './storage'
import { create } from '@dstack-js/ipfs'

export interface Peer {
  id: string;
  address: string;
}

export interface PeerAnnouncement {
  kind: 'announcement';
  peer: Peer;
}

export type StackPubSubMessage = PeerAnnouncement;

export interface StackOptions {
  namespace: string;
  /**
   * IPFS Instance
   *
   * No need to provide it unless you want custom IPFS instance to be used
   * `@dstack-js/ipfs` will be used by default
   */
  ipfs?: IPFS;
  /**
   * WebRTC implementation
   *
   * No need to provide it unless you want to use DStack in non browser environment
   */
  wrtc?: any;
  /**
   * Relay GraphQL Endpoint
   *
   * Defaults to DStack Cloud
   */
  relay?: string;
  /**
   * Storage implementation
   *
   * No need to provide it unless you want custom storage implementation to be used
   */
  storage?: Storage;
}

export class Stack {
  public pubsub: PubSub<StackPubSubMessage>
  public store: Store

  private announceInterval?: ReturnType<typeof setTimeout>
  public announce = false

  constructor(public namespace: CID, public ipfs: IPFS, storage: Storage) {
    this.pubsub = new PubSub(ipfs, namespace.toString())
    this.store = new Store(this, storage)
  }

  /**
   * get this peer info
   */
  public async id(): Promise<Peer> {
    const result = await this.ipfs.id()

    return {
      id: result.id,
      address: result.addresses[0].toString()
    }
  }

  private get libp2p() {
    return (this.ipfs as any).libp2p as Libp2p
  }

  public async start(): Promise<void> {
    this.announceInterval = setInterval(async () => {
      if (!this.announce) return
      await this.pubsub.publish('announce', {
        kind: 'announcement',
        peer: await this.id()
      })
    }, 250)

    await this.store.start()
  }

  public async stop(): Promise<void> {
    if (this.announceInterval) clearInterval(this.announceInterval)
    await this.store.stop()
    await this.pubsub.stop()
  }

  /**
   * Create stack
   *
   * @returns Stack instance
   */
  public static async create({
    namespace,
    ipfs,
    storage,
    relay,
    wrtc
  }: StackOptions) {
    if (!ipfs) {
      ipfs = await create({ namespace, relay, wrtc })
    }

    const cid = await ipfs.dag.put({ namespace })
    storage = storage || new Storage(namespace)

    const stack = new Stack(cid, ipfs, storage)
    await stack.start()

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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.libp2p.addressManager.on('peer:connect', (event) => {
      listener({
        id: event.remotePeer.toB58String(),
        address: event.remoteAddr.toString()
      })
    })
  }

  /**
   * Listen on peer disconnected
   *
   * @param listener Will be called with peer info
   */
  public onPeerDisconnected(listener: (peer: Peer) => void): void {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.libp2p.addressManager.on('peer:disconnect', (event) => {
      listener({
        id: event.remotePeer.toB58String(),
        address: event.remoteAddr.toString()
      })
    })
  }

  /**
   * Ping peer
   *
   * @param peer destination
   * @param options timeout and cycles settings `{ timeout: 1000, count: 10 }`
   * @returns round-trip time in ms
   */
  public async ping(
    peer: Peer,
    { timeout = 1000, count = 10 }
  ): Promise<number> {
    let ping = await all(this.ipfs.ping(peer.id, { count, timeout }))
    ping = ping.filter(({ success }) => success)

    const result = ping.slice(-1)[0].text.match(/\d+.\d+ms/)
    if (!ping.length || !result) throw new PeerUnreachableError()

    return parseFloat(result[0].split('ms')[0])
  }
}
