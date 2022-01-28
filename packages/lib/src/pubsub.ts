import type { IPFS } from "ipfs-core"
import { Buffer } from "buffer"
import { v4 as uuid } from "uuid"

export interface Message<T> {
  from: string
  data: T
}

export class PubSub<T = unknown> {
  constructor(public ipfs: IPFS, public namespace: string) { }

  private getTopic(topic: string): string {
    return `${this.namespace}.${topic}`
  }

  private encode(data: T): string {
    return JSON.stringify(data)
  }

  private decode(data: string): T {
    return JSON.parse(data)
  }

  public async topics(ignoreInternals = true): Promise<string[]> {
    const topic = await this.ipfs.pubsub.ls()

    return topic
      .filter((value) => {
        if (ignoreInternals && value.includes('$')) {
          return false
        }

        return true
      })
      .map((topic) => topic.replace(`${this.namespace}.`, ''))
  }

  public async peers(topic: string): Promise<number> {
    const peers = await this.ipfs.pubsub.peers(this.getTopic(topic))

    return peers.length
  }

  public async subscribe(topic: string, listener: (msg: Message<T>) => void): Promise<void> {
    await this.ipfs.pubsub.subscribe(this.getTopic(topic), (message) => {
      listener({
        from: message.from,
        data: this.decode(Buffer.from(message.data).toString())
      })
    })
  }

  public async handleRequest(method: string, listener: (args: any[], reply: (data: any) => void) => Promise<any> | any): Promise<void> {
    await this.subscribe(method, async (msg) => {
      const data = msg.data as unknown as { reply: string; args: any[] }
      listener(data.args, (data) => this.publish(data.reply, data))
    })
  }

  public async request(method: string, args: any[], timeout = 1000): Promise<any> {
    const reply = uuid()

    // eslint-disable-next-line no-async-promise-executor
    return new Promise<any>(async (resolve, reject) => {
      await this.subscribe(reply, (msg) => resolve(msg.data))
      setTimeout(() => reject('timeout'), timeout)
      await this.publish(method, { reply, args } as any)
    })
  }

  private async waitForPeers(topic: string, depth = 0): Promise<void> {
    depth++
    const peers = await this.peers(topic)

    if (!peers) {
      console.debug('Waiting for peers to appear before publishing to', topic)
      await new Promise((resolve) => setTimeout(resolve, 2 * depth * 10))
      return this.waitForPeers(topic, depth)
    }
  }

  public async publish(topic: string, data: T, waitForPeers = true): Promise<void> {
    if (!waitForPeers) await this.waitForPeers(topic)
    await this.ipfs.pubsub.publish(this.getTopic(topic), Buffer.from(this.encode(data)))
  }

  public async unsubscribe(topic: string): Promise<void> {
    await this.ipfs.pubsub.unsubscribe(this.getTopic(topic))
  }
}
