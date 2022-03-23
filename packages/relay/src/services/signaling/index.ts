import type { FastifyInstance } from 'fastify'
import type { WebRTCStarSocket } from '@libp2p/webrtc-star-protocol'
import fastifyIO from 'fastify-socket.io'
import {
  addPeer,
  emitPeerSocket,
  getPeers,
  onPeerConnect,
  setPeerSocket
} from './peer'
import {
  dialsFailureTotal,
  dialsSuccessTotal,
  dialsTotal,
  joinsFailureTotal,
  joinsTotal
} from '../metrics'

const handle = (socket: WebRTCStarSocket, cachePrefix: string) => {
  console.log('signaling', 'handle', socket.id)
  const closeFunctions: (() => Promise<void>)[] = []
  const close = () => {
    console.log('signaling', 'close', socket.id, multiaddr)
    closeFunctions.forEach((close) => close())
  }

  let multiaddr: string

  socket.on('ss-join', async (ma) => {
    joinsTotal.inc()

    if (!ma) return joinsFailureTotal.inc()

    multiaddr = ma
    closeFunctions.push(await addPeer(multiaddr, cachePrefix))
    closeFunctions.push(await setPeerSocket(cachePrefix, multiaddr, socket))
    closeFunctions.push(await onPeerConnect(socket, cachePrefix))
    console.log('signaling', 'ss-join', socket.id, multiaddr)
  })

  socket.on('disconnect', close)
  socket.on('ss-leave', close)

  socket.on('ss-handshake', async (offer) => {
    dialsTotal.inc()

    if (
      offer == null ||
      typeof offer !== 'object' ||
      offer.srcMultiaddr == null ||
      offer.dstMultiaddr == null
    ) {
      dialsFailureTotal.inc()
      console.warn('dial failure', offer, multiaddr)
      return
    }

    const peers = await getPeers(cachePrefix)

    if (offer.answer === true) {
      dialsSuccessTotal.inc()
      await emitPeerSocket(
        cachePrefix,
        offer.srcMultiaddr,
        'ws-handshake',
        offer
      )
    } else if (peers.includes(offer.dstMultiaddr)) {
      await emitPeerSocket(
        cachePrefix,
        offer.dstMultiaddr,
        'ws-handshake',
        offer
      )
    } else if (peers.includes(offer.srcMultiaddr)) {
      dialsFailureTotal.inc()
      offer.err = 'peer is not available'
      await emitPeerSocket(
        cachePrefix,
        offer.srcMultiaddr,
        'ws-handshake',
        offer
      )
    }

    console.log(
      'signaling',
      'ss-handshake',
      socket.id,
      offer.srcMultiaddr,
      offer.dstMultiaddr,
      offer.err || ''
    )
  })
}

export const setSocket = async (server: FastifyInstance) => {
  server.register(fastifyIO, {
    allowEIO3: true,
    transports: ['websocket'],
    cors: { origin: '*' },
    path: '/socket.io-next/'
  })

  await server.ready()
  server.io.on('connection', (socket) => {
    const cachePrefix = socket.handshake.headers['X-DStack-Namespace']
      ? `!${socket.handshake.headers['X-DStack-Namespace']}`
      : ''

    // @ts-expect-error: incompatible types
    return handle(socket, cachePrefix)
  })
}
