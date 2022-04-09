import type { Address } from '@libp2p/interfaces/peer-store'
import { Libp2p } from 'libp2p'
import type { PeerId } from '@libp2p/interfaces/peer-id'

export class Peer {
  constructor(
    public readonly id: string,
    public readonly addresses: Address[],
    private readonly libp2p: Libp2p
  ) { }

  static async fromPeerId(peerId: PeerId, libp2p: Libp2p): Promise<Peer> {
    const addresses = await libp2p.peerStore.addressBook.get(peerId)
    return new Peer(peerId.toString(), addresses, libp2p)
  }
}