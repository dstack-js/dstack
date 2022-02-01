import IPFS from 'ipfs'
import type { Options as IPFSOptions } from 'ipfs-core'
// @ts-expect-error: no-types
import WebRTCStar from 'libp2p-webrtc-star'
// @ts-expect-error: no-types
import WS from 'libp2p-websockets'
import { NOISE } from '@chainsafe/libp2p-noise'
import { listen } from './addresses'

export type Options = Omit<IPFSOptions, 'libp2p'>

export const create = (options?: Options, wrtc?: any): Promise<IPFS.IPFS> => {
  return IPFS.create({
    config: {
      Discovery: {
        webRTCStar: { Enabled: true }
      },
      Addresses: {
        Swarm: listen
      },
      Bootstrap: [
        '/dns4/relay.dstack.dev/tcp/443/wss/p2p-webrtc-star/p2p/QmV2uXBKbii29iJKHKVy8sx5m49qdDTBYNybVoa5uLJtrf'
      ],
      ...options?.config
    },
    ...options,
    relay: {
      enabled: true,
      hop: {
        enabled: true
      }
    },
    libp2p: {
      modules: {
        transport: [WS, WebRTCStar],
        connEncryption: [NOISE]
      },
      config: {
        peerDiscovery: {
          webRTCStar: {
            enabled: true
          }
        },
        transport: {
          WebRTCStar: {
            wrtc
          }
        }
      },
      dht: {
        enabled: true,
        kBucketSize: 20
      }
    }
  })
}
