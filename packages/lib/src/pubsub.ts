import type { IPFS } from "ipfs-core"
import { Buffer } from "buffer"

export interface Message<T> {
  from: string
  data: T
}

export class PubSub<T = unknown> {
  constructor(public ipfs: IPFS, public name: string) {

  }

  private getTopic(topic: string): string {
    return `${this.name}/${topic}`
  }

  private encode(data: T): string {
    return JSON.stringify(data)
  }

  private decode(data: string): T {
    return JSON.parse(data)
  }

  public async subscribe(topic: string, listener: (msg: Message<T>) => void): Promise<void> {
    await this.ipfs.pubsub.subscribe(this.getTopic(topic), (message) => {
      listener({
        from: message.from,
        data: this.decode(Buffer.from(message.data).toString())
      })
    })
  }

  public async publish(topic: string, data: T): Promise<void> {
    await this.ipfs.pubsub.publish(this.getTopic(topic), Buffer.from(this.encode(data)))
  }

  public async unsubscribe(topic: string): Promise<void> {
    await this.ipfs.pubsub.unsubscribe(this.getTopic(topic))
  }
}
