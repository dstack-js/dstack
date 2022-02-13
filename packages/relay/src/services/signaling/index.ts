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

const handle = (socket: WebRTCStarSocket) => {
  const closeFunctions: (() => Promise<void>)[] = []
  const close = () => closeFunctions.forEach((close) => close())

  let multiaddr: string

  socket.on('ss-join', async (ma) => {
    if (!ma) return

    multiaddr = ma

    closeFunctions.push(await addPeer(multiaddr))
    closeFunctions.push(await setPeerSocket(multiaddr, socket))
    closeFunctions.push(await onPeerConnect(socket))
  })

  socket.on('disconnect', close)
  socket.on('ss-leave', close)

  socket.on('ss-handshake', async (offer) => {
    if (
      offer == null ||
      typeof offer !== 'object' ||
      offer.srcMultiaddr == null ||
      offer.dstMultiaddr == null
    ) {
      console.warn('dial failure', offer, multiaddr)
      return
    }

    const peers = await getPeers()

    if (offer.answer === true) {
      await emitPeerSocket(offer.srcMultiaddr, 'ws-handshake', offer)
    } else if (peers.includes(offer.dstMultiaddr)) {
      await emitPeerSocket(offer.dstMultiaddr, 'ws-handshake', offer)
    } else if (peers.includes(offer.srcMultiaddr)) {
      offer.err = 'peer is not available'
      await emitPeerSocket(offer.srcMultiaddr, 'ws-handshake', offer)
    }
  })
}

export const setSocket = async (server: FastifyInstance) => {
  server.register(fastifyIO, { allowEIO3: true })

  await server.ready()
  // @ts-expect-error: incompatible types
  server.io.on('connection', (socket) => handle(socket))
}
