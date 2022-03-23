import { WebRTCStar } from '@dstack-js/transport'
// @ts-expect-error: no types
import WebSocket from 'libp2p-websockets'
import { create as IPFSCreate, PeerId, CID } from 'ipfs'
import type { IPFS, Options as IPFSOptions } from 'ipfs-core'
import { bootstrap } from './bootstrap'

const create = async (
  options: Partial<IPFSOptions> & { namespace: string; relay?: string },
  wrtc?: any
): Promise<IPFS> => {
  const { listen, peers } = await bootstrap(options.namespace, options.relay)

  return IPFSCreate({
    config: {
      Discovery: {
        webRTCStar: { Enabled: true }
      },
      Addresses: {
        Swarm: listen
      },
      Bootstrap: peers,
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
      ...options?.libp2p,
      modules: {
        transport: [WebRTCStar, WebSocket]
      },
      config: {
        peerDiscovery: {
          webRTCStar: {
            enabled: true
          }
        },
        transport: {
          WebRTCStar: {
            wrtc,
            namespace: options.namespace
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

export { PeerId, CID, create }
