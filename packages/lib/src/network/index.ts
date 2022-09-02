import { Libp2p, createLibp2p } from "libp2p"
import EventEmitter from "events"
import { FloodSub } from "@libp2p/floodsub"
import { KadDHT } from "@libp2p/kad-dht"
import { Mplex } from "@libp2p/mplex"
import { NetworkOptions } from "./interfaces"
import { Noise } from "@chainsafe/libp2p-noise"
import { Peer } from "./peer"
import { WebRTCStar } from "@libp2p/webrtc-star"
import { createFromProtobuf } from "@libp2p/peer-id-factory"
import { multiaddr } from "@multiformats/multiaddr"

export class Network extends EventEmitter {
  private constructor (public libp2p: Libp2p, public options: NetworkOptions) {
    super()

    libp2p.connectionManager.addEventListener("peer:connect", (event) => {
      this.emit("connected", Peer.fromPeerId(event.detail.remotePeer, this))
    })

    libp2p.connectionManager.addEventListener("peer:disconnect", (event) => {
      this.emit("disconnected", Peer.fromPeerId(event.detail.remotePeer, this))
    })

    libp2p.addEventListener("peer:discovery", (event) => {
      this.emit("discovered", Peer.fromPeerId(event.detail.id, this))

      if (options.autoConnect) {
        this.connect(event.detail.multiaddrs[0].toString())
          .catch((err) => this.emit("error", err))
      }
    })
  }

  public async knownPeers (): Promise<Peer[]> {
    const peers = await this.libp2p.peerStore.all()
    return peers.map((peer) => Peer.fromPeerId(peer.id, this))
  }

  public get addresses (): string[] {
    return this.libp2p.getMultiaddrs().map((addr) => addr.toString())
  }

  public get identity (): Peer {
    return Peer.fromPeerId(this.libp2p.peerId, this)
  }

  public async connect (address: string): Promise<Peer> {
    const connection = await this.libp2p.dial(multiaddr(address) as any)
    const peerId = connection.remotePeer

    return Peer.fromPeerId(peerId, this)
  }

  static async create (options: NetworkOptions): Promise<Network> {
    const mplex = new Mplex()
    const pubsub = new FloodSub()
    const webrtcStar = new WebRTCStar()
    const dht = new KadDHT({
      protocolPrefix: "dstack"
    })
    const noise = new Noise(options.sharedSecret && new TextEncoder().encode(options.sharedSecret))

    const libp2p = await createLibp2p({
      relay: {
        enabled: true
      },
      dht,
      transports: [webrtcStar],
      pubsub,
      streamMuxers: [mplex],
      connectionEncryption: [noise],
      addresses: {
        listen: options.listen
      },
      peerId: options.identity && await createFromProtobuf(Buffer.from(options.identity, "base64"))
    })

    await webrtcStar.discovery.start()
    await libp2p.start()

    return new Network(libp2p, options)
  }
}

export * from "./interfaces"
export * from "./peer"
