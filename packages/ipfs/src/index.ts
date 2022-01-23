import * as IPFS from "ipfs-core"
import { listen } from "./addresses"

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import WebRTCStar from 'libp2p-webrtc-star'

export type Options = Omit<IPFS.Options, "libp2p">

export const create = (options?: Options, wrtc?: any): Promise<IPFS.IPFS> => {
  return IPFS.create({
    config: {
      Discovery: {
        webRTCStar: { Enabled: true },
      },
      Addresses: {
        Swarm: listen,
      },
      Bootstrap: ['/dns4/dstack-relay.herokuapp.com/tcp/443/wss/p2p-webrtc-star/p2p/QmV2uXBKbii29iJKHKVy8sx5m49qdDTBYNybVoa5uLJtrf'],
      ...options?.config
    },
    ...options,
    libp2p: {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      modules: {
        transport: [WebRTCStar]
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
      },
    },
  })
}
