/* eslint-disable @typescript-eslint/ban-ts-comment */
/*
  No TypeScript support for some of libp2p modules 😕
  https://github.com/libp2p/js-libp2p/issues/659
*/
// @ts-ignore
import WS from "libp2p-websockets"
// @ts-ignore
import { NOISE } from "libp2p-noise"
import gossip from "libp2p-gossipsub"
// @ts-ignore
import mplex from "libp2p-mplex"
// @ts-ignore
import WStar from "libp2p-webrtc-star"
import KadDHT from 'libp2p-kad-dht'
import Libp2p from 'libp2p'
import type { Libp2pFactoryFnArgs } from "ipfs-core"

export const libp2p = async (opts: Libp2pFactoryFnArgs) => {
  return new Libp2p({
    ...opts,
    connectionManager: {
      pollInterval: 5000
    },
    modules: {
      transport: [WS, WStar],
      streamMuxer: [mplex],
      connEncryption: [NOISE],
      // @ts-ignore
      pubsub: gossip,
      dht: KadDHT
    },
    config: {
      peerDiscovery: {
        pubsub: {
          enabled: true,
          emitSelf: false
        }
      },
      relay: {
        enabled: true,
        hop: {
          enabled: true,
          active: true
        }
      },
      dht: {
        enabled: true,
        kBucketSize: 20
      },
    }
  })
}
