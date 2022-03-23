import type { WebRTCStarSocket } from '@libp2p/webrtc-star-protocol'
import { publisher, redis, subscriber } from '../cache'

const GLOBAL_PREFIX = 'g#'
const PEER_PREFIX = 'p#'

export const addPeer = async (multiaddr: string, cachePrefix: string) => {
  await redis.set(`${cachePrefix}${PEER_PREFIX}${multiaddr}`, multiaddr)
  await publisher.publish(`${cachePrefix}${GLOBAL_PREFIX}join`, multiaddr)

  return async () => {
    await redis.del(`${cachePrefix}${PEER_PREFIX}${multiaddr}`)
    await publisher.publish(`${cachePrefix}${GLOBAL_PREFIX}gone`, multiaddr)
  }
}

export const onPeerConnect = async (
  socket: WebRTCStarSocket,
  cachePrefix: string,
  ignore?: string
) => {
  const listener = (multiaddr: string) => {
    if (multiaddr === ignore) return

    socket.emit('ws-peer', multiaddr)
  }

  await subscriber.subscribe(`${cachePrefix}${GLOBAL_PREFIX}join`, listener)

  return () =>
    subscriber.unsubscribe(`${cachePrefix}${GLOBAL_PREFIX}join`, listener)
}

export const getPeers = async (cachePrefix: string) => {
  return redis.keys(`${cachePrefix}${PEER_PREFIX}*`).then((keys) => {
    return keys.map((multiaddr) => multiaddr.replace(PEER_PREFIX, ''))
  })
}

type EventNames = Parameters<WebRTCStarSocket['on']>[0];

interface SocketEvent {
  event: EventNames;
  params: unknown[];
}

export const setPeerSocket = async (
  cachePrefix: string,
  multiaddr: string,
  socket: WebRTCStarSocket
) => {
  const ma = await redis.get(`${cachePrefix}${PEER_PREFIX}${multiaddr}`)
  if (!ma) throw new Error('notFound')

  const listener = (msg: string) => {
    const { event, params } = JSON.parse(msg) as SocketEvent

    // TODO: remove 'connect' from EventNames
    // @ts-expect-error: incompatible type
    socket.emit(event, ...params)
  }

  subscriber.subscribe(ma, listener)

  return () => subscriber.unsubscribe(ma, listener)
}

export const emitPeerSocket = async (
  cachePrefix: string,
  multiaddr: string,
  event: EventNames,
  ...params: unknown[]
) => {
  const ma = await redis.get(`${cachePrefix}${PEER_PREFIX}${multiaddr}`)

  if (!ma) {
    console.warn('trying to emitPeerSocket but', ma, 'is gone')
    return
  }

  const payload: SocketEvent = { event, params }

  await publisher.publish(ma, JSON.stringify(payload))
  console.log('signaling', 'peer/emitPeerSocket', ma, event)
}
