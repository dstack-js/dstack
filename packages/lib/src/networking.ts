import { Libp2p, createLibp2p } from 'libp2p'
import { Buffer } from 'buffer'
import { Gossipsub } from '@achingbrain/libp2p-gossipsub'
import { Mplex } from '@libp2p/mplex'
import { Noise } from '@chainsafe/libp2p-noise'
import { Peer } from './peer'
import { PreSharedKeyConnectionProtector } from 'libp2p/pnet'
import { WebRTCStar } from '@libp2p/webrtc-star'
import { WebSockets } from '@libp2p/websockets'
import isoRandomBytes from 'iso-random-stream/src/random.js'
import { sha256 } from './utils'

export class Networking {
  private constructor(public readonly namespace: string, public libp2p: Libp2p) { }

  connected(): Promise<Peer[]> {
    return Promise.all(this.libp2p.getPeers().map((peerId) => Peer.fromPeerId(peerId, this.libp2p)))
  }

  me(): Promise<Peer> {
    return Peer.fromPeerId(this.libp2p.peerId, this.libp2p)
  }

  async stop(): Promise<void> {
    await this.libp2p.stop()
  }

  static async generatePSK(namespace?: string): Promise<string> {
    const psk = namespace ? sha256(namespace) : Buffer.from(isoRandomBytes(32)).toString('hex')
    const key = Buffer.from('/key/swarm/psk/1.0.0/\n/base16/\n' + psk)

    return key.toString('base64')
  }

  static async create(namespace: string, listen: string[], psk?: string): Promise<Networking> {
    const webRtcStar = new WebRTCStar()

    const libp2p = await createLibp2p({
      addresses: {
        listen
      },
      transports: [
        new WebSockets(),
        webRtcStar
      ],
      connectionEncryption: [new Noise()],
      streamMuxers: [new Mplex()],
      peerDiscovery: [
        webRtcStar.discovery,
      ],
      connectionProtector: new PreSharedKeyConnectionProtector({
        enabled: true,
        psk: psk ? Buffer.from(psk, 'base64') : Buffer.from(await Networking.generatePSK(namespace), 'base64')
      }),
      pubsub: new Gossipsub({ globalSignaturePolicy: 'StrictNoSign', fallbackToFloodsub: true })
    })

    await libp2p.start()

    return new Networking(namespace, libp2p)
  }
}
