import * as IPFS from "ipfs-core"
import { libp2p } from "./libp2p"

export const create = (options?: IPFS.Options): Promise<IPFS.IPFS> => {
  return IPFS.create({
    ...options,
    config: {
      ...options?.config,
      Addresses: {
        ...options?.config?.Addresses,
        Swarm: [
          ...(options?.config?.Addresses?.Swarm || [
            '/dns4/dstack-relay.herokuapp.com/tcp/443/wss/p2p-webrtc-star/'
          ]),
        ],
      }
    },
    libp2p: options?.libp2p || libp2p
  })
}
