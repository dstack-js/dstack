import { IPFS, create as IPFSCreate, PeerId, CID } from 'ipfs-core'
import { bootstrap } from './bootstrap'
import { libp2pBundle } from './libp2p'

export interface Options {
  namespace: string;
  relay?: string;
  wrtc?: any;
}

export { CID, PeerId }

export const create = async ({
  namespace,
  relay,
  wrtc
}: Options): Promise<IPFS> => {
  const { listen, peers } = await bootstrap(namespace, relay)

  return IPFSCreate({
    config: {
      Discovery: {
        webRTCStar: { Enabled: true }
      },
      Addresses: {
        Swarm: listen
      },
      Bootstrap: peers
    },
    libp2p: libp2pBundle(namespace, wrtc),
    relay: {
      enabled: true,
      hop: {
        enabled: true
      }
    }
  })
}
