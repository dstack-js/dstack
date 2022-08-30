import { Libp2p, createLibp2p } from "libp2p"
import EventEmitter from "events"
import { GossipSub } from "@chainsafe/libp2p-gossipsub"
import { KadDHT } from "@libp2p/kad-dht"
import { Mplex } from "@libp2p/mplex"
import { NetworkOptions } from "./interfaces"
import { Noise } from "@chainsafe/libp2p-noise"
import { WebRTCStar } from "@libp2p/webrtc-star"

export class Network extends EventEmitter {
  private constructor (public libp2p: Libp2p) {
    super()
  }

  public get addresses (): string[] {
    return this.libp2p.getMultiaddrs().map((addr) => addr.toString())
  }

  public get id (): string {
    return this.libp2p.peerId.toString()
  }

  static async create (options: NetworkOptions): Promise<Network> {
    const mplex = new Mplex()
    const pubsub = new GossipSub()
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
      ...options
    })

    await webrtcStar.discovery.start()
    await libp2p.start()

    return new Network(libp2p)
  }
}

export * from "./interfaces"
