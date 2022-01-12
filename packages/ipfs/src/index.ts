import * as IPFS from "ipfs-core"

export const create = (options?: IPFS.Options): Promise<IPFS.IPFS> => {
  return IPFS.create({
    ...options,
    config: {
      ...options?.config,
      Addresses: {
        ...options?.config?.Addresses,
        Swarm: [
          ...(options?.config?.Addresses?.Swarm || [
            '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star',
            '/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star'
          ]),
        ],
      },
      Bootstrap: []
    },
    libp2p: options?.libp2p || {
      config: {
        dht: {
          enabled: true
        }
      }
    }
  })
}
