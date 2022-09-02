import type { Network } from "."
import type { PeerId } from "@libp2p/interface-peer-id"
// import { SecretIsNotAvailable } from "../errors"
import type { TagOptions } from "@libp2p/interface-peer-store"
import { createEd25519PeerId } from "@libp2p/peer-id-factory"

export class Peer {
  private constructor (
    public peerId: PeerId,
    private network: Network
  ) { }

  public get id (): string {
    return this.peerId.toString()
  }

  public async known () {
    return this.network.libp2p.peerStore.has(this.peerId)
  }

  public async remember () {
    const peer = await this.network.libp2p.peerStore.get(this.peerId)
    const multiaddrs = peer.addresses.map((address) => address.multiaddr)

    return this.network.libp2p.peerStore.addressBook.add(peer.id, multiaddrs)
  }

  public async addTag (tag: string, options?: TagOptions) {
    await this.network.libp2p.peerStore.tagPeer(this.peerId, tag, options)
  }

  public async getTags () {
    return this.network.libp2p.peerStore.getTags(this.peerId)
  }

  public async removeTag (tag: string) {
    return this.network.libp2p.peerStore.unTagPeer(this.peerId, tag)
  }

  // TODO: fix protobufjs bundling issue
  // public getIdentity (): string {
  //   if (!this.peerId.privateKey || ("toProtobuf" in this.peerId)) {
  //     throw new SecretIsNotAvailable()
  //   }

  //   const buf = exportToProtobuf(this.peerId)

  //   return Buffer.from(buf).toString("base64")
  // }

  public static fromPeerId (peerId: PeerId, network: Network): Peer {
    return new Peer(peerId, network)
  }

  // public static async fromIdentity (identity: string, network: Network): Promise<Peer> {
  //   const buf = Buffer.from(identity, "base64")
  //   const peerId = await createFromProtobuf(buf)

  //   return new Peer(peerId, network)
  // }

  public static async create (network: Network): Promise<Peer> {
    const peerId = await createEd25519PeerId()

    return new Peer(peerId, network)
  }
}
