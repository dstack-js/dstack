import { Libp2pOptions } from "libp2p"
import { WebRTCStarInit } from "@libp2p/webrtc-star"

export interface NetworkOptions {
  peerId?: Libp2pOptions["peerId"]
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
}
