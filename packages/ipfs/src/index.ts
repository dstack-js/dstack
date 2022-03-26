import { IPFS, create as IPFSCreate, PeerId, CID } from 'ipfs-core'
import { bootstrap } from './bootstrap'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import WebRTCStar from '@dstack-js/transport'
import type { IPFSOptions } from 'ipfs-core/src/components/storage'

export interface Options {
  namespace: string;
  relay?: string;
  wrtc?: any;
  privateKey?: string;
  repo?: IPFSOptions['repo'];
}

export { CID, PeerId }

export const create = async ({
  namespace,
  relay,
  wrtc,
  privateKey,
  repo
}: Options): Promise<IPFS> => {
  const { listen, peers } = await bootstrap(namespace, relay)

  return IPFSCreate({
    init: { privateKey },
    repo,
    config: {
      Discovery: {
        webRTCStar: { Enabled: true }
      },
      Addresses: {
        Swarm: listen
      },
      Bootstrap: peers
    },
    libp2p: {
      // @ts-expect-error: incorrect type
      modules: {
        transport: [WebRTCStar]
      },
      config: {
        dht: {
          enabled: true
        },
        peerDiscovery: {
          webRTCStar: {
            enabled: true
          }
        },
        transport: {
          WebRTCStar: {
            wrtc,
            namespace
          }
        }
      }
    },
    relay: {
      enabled: true,
      hop: {
        enabled: true,
        active: true
      }
    }
  })
}
