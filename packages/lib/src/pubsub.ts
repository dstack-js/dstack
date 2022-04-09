import { Gossipsub } from '@achingbrain/libp2p-gossipsub'
import { Networking } from './networking'

export class PubSub {
  private pubsub: Gossipsub

  constructor(
    public readonly namespace: string,
    private readonly networking: Networking
  ) {
    if (!(networking.libp2p.pubsub instanceof Gossipsub)) throw new Error('networking.libp2p.pubsub must be an instance of Gossipsub')
    this.pubsub = networking.libp2p.pubsub
  }

  private getTopic(topic: string): string {
    return `${this.namespace}/${topic}`
  }

  /**
   * Publish message to a topic
   * 
   * @param topic topic to send an message to
   * @param message message data
   */
  async publish(topic: string, message: Uint8Array): Promise<void> {
    await this.pubsub.publishMessage(null, {
      from: this.networking.libp2p.peerId,
      topic: this.getTopic(topic),
      data: message
    })
  }

  /**
   * Subscibe to messages on a topic
   * 
   * @param topic topic to subscribe to
   * @param listener A callback to handle messages
   */
  subscribe(topic: string, listener: (message: { from: string, data: Uint8Array }) => void): void {
    const _topic = this.getTopic(topic)

    this.pubsub.addEventListener(_topic, (event) => {
      listener({
        from: event.detail.from.toString(),
        data: event.detail.data
      })
    })

    this.pubsub.subscribe(_topic)
  }

  /**
   * Unsubscribe from a topic
   * 
   * @param topic topic to unsubscribe from
   */
  unsubscribe(topic: string): void {
    const _topic = this.getTopic(topic)
    this.pubsub.unsubscribe(_topic)
  }

  /**
   * Get all topics
   * 
   * @returns topics list
   */
  public async topics(): Promise<string[]> {
    const topics = this.pubsub.getTopics()

    return topics
      .filter(topic => topic.includes(`${this.namespace}/`))
      .map(topic => topic.replace(`${this.namespace}/`, ''))
  }
}
