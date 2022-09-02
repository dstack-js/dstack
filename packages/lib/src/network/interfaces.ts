import type { WebRTCStarInit } from "@libp2p/webrtc-star"

export interface NetworkOptions {
  /**
   * Peer identity to use.
   *
   * If not provided, a new identity will be generated.
   *
   * Identity is a base64-encoded protobuf object, you can get one using `await Peer.getIdentity()`.
   */
  identity?: string

  /**
     Shared secret used to make handshakes between peers faster.

     must be at least 32 bytes long
   */
  sharedSecret?: string

  /**
   * List of [webrtc star signalling servers](https://github.com/libp2p/js-libp2p-webrtc-star/tree/master/packages/webrtc-star-signalling-server) to listen on.
   */
  listen: string[]

  /**
   * You can provide custom webrtc implementation for non-browser environments.
   */
  webrtc?: WebRTCStarInit["wrtc"]

  /**
   * autoconnect to peers when they being discovered
   **/
  autoConnect?: boolean
}
