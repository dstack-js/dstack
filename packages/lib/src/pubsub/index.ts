import { Network, Peer } from "../network"
import { PublishMetadata, SubscriptionEventListener } from "./interfaces"
import { decode, encode } from "cborg"
import { GossipSub } from "@chainsafe/libp2p-gossipsub"
import { InvalidPubsubImplementation } from "../errors"
import { Stack } from "../stack"

export class PubSub {
  private gossipsub: GossipSub
  private network: Network

  constructor (stack: Stack) {
    if (!(stack.network.libp2p.pubsub instanceof GossipSub)) {
      throw new InvalidPubsubImplementation()
    }

    this.network = stack.network
    this.gossipsub = stack.network.libp2p.pubsub
  }

  public async publishRaw (topic: string, data: Uint8Array): Promise<PublishMetadata> {
    const result = await this.gossipsub.publish(topic, data)

    return {
      topic,
      data,
      recipients: result.recipients.map((peerId) => Peer.fromPeerId(peerId, this.network))
    }
  }

  public subscribeRaw (topic: string, listener: SubscriptionEventListener<Uint8Array>): void {
    this.gossipsub.subscribe(topic)

    this.gossipsub.addEventListener("message", (ev) => {
      const { topic, data } = ev.detail

      listener({
        topic,
        data,
        from: "from" in ev.detail ? Peer.fromPeerId(ev.detail.from, this.network) : null
      })
    })
  }

  public subscribe<T = any> (topic: string, listener: SubscriptionEventListener<T>): void {
    this.subscribeRaw(topic, (event) => {
      listener({
        ...event,
        data: decode(event.data)
      })
    })
  }

  public publish<T = any> (topic: string, data: T): void {
    this.publishRaw(topic, encode(data))
  }

  public unsubscribe (topic: string): void {
    this.gossipsub.unsubscribe(topic)
  }
}
