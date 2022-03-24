/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Bootstrap } from '@libp2p/bootstrap'
import { NOISE } from '@chainsafe/libp2p-noise'
import { Mplex } from '@libp2p/mplex'
import type { Libp2pFactoryFn } from 'ipfs-core'
// @ts-ignore
import WebRTCStar from '@dstack-js/transport'
import GossipSub from 'libp2p-gossipsub'
import Libp2p from 'libp2p'

export const libp2pBundle =
  (namespace: string, wrtc?: any): Libp2pFactoryFn =>
    (opts) => {
      const peerId = opts.peerId
      const bootstrapList = opts.config.Bootstrap

      class Transport extends WebRTCStar {
        constructor(opts: any) {
          opts.namespace = namespace
          opts.wrtc = wrtc
          super(opts)
        }
      }

      return Libp2p.create({
        addresses: {
          listen: opts.config.Addresses?.Swarm || []
        },
        peerId,
        connectionManager: {
          pollInterval: 5000
        },
        modules: {
          transport: [
          // @ts-ignore
            Transport
          ],
          streamMuxer: [
          // @ts-ignore
            Mplex
          ],
          connEncryption: [
          // @ts-ignore
            NOISE
          ],
          peerDiscovery: [
          // @ts-ignore
            Bootstrap
          ],
          pubsub: GossipSub
        },
        config: {
          peerDiscovery: {
            autoDial: true,
            webRTCStar: {
              enabled: true
            },
            [Bootstrap.tag]: {
              interval: 30e3,
              enabled: !!bootstrapList?.length,
              list: bootstrapList
            }
          },
          relay: {
            enabled: true,
            hop: {
              enabled: true,
              active: true
            }
          },
          pubsub: {
            enabled: true
          }
        },
        metrics: {
          enabled: true,
          computeThrottleMaxQueueSize: 1000,
          computeThrottleTimeout: 2000,
          movingAverageIntervals: [
            60 * 1000, // 1 minute
            5 * 60 * 1000, // 5 minutes
            15 * 60 * 1000 // 15 minutes
          ],
          maxOldPeersRetention: 50
        }
      })
    }
