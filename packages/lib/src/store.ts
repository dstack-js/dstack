import { Message, PubSub } from './pubsub'
import { Shard } from './shard'
import { Stack } from './stack'

export interface ReplicateMessage {
  kind: 'replicate'
  key: string
  value: string
  date: string
}

export interface ReplicateRequestMessage {
  kind: 'replicateRequest'
}

export type StackMessage = ReplicateMessage | ReplicateRequestMessage

export class Store {
  private pubsub: PubSub<StackMessage>
  private data: { [key: string]: { value: string; date: Date } } = {}

  constructor(private stack: Stack) {
    this.pubsub = stack.pubsub.create('$$store')
  }

  private async onReplicate(msg: Message<StackMessage>): Promise<void> {
    if (msg.data.kind !== 'replicate') return

    const local = this.data[msg.data.key]
    const date = new Date(msg.data.date)

    if (local?.date > date) return

    this.data[msg.data.key] = {
      value: msg.data.value,
      date
    }
  }

  private watchShard(key: string, watch: Shard) {
    watch.on('update', async (shard): Promise<void> => {
      this.data[key] = {
        value: shard.toString(),
        date: new Date()
      }

      await this.replicate(key)
    })
  }

  public async get<TData = unknown>(key: string): Promise<Shard<TData> | null> {
    if (!this.data[key]) return null

    const shard = await Shard.from<TData>(this.stack, this.data[key].value)

    this.watchShard(key, shard)

    return shard
  }

  public async set<TData = unknown>(key: string, shard: Shard<TData>): Promise<void> {
    this.data[key] = {
      value: shard.toString(),
      date: new Date()
    }

    this.watchShard(key, shard)
    await this.replicate(key)
  }

  private async replicate(key: string): Promise<void> {
    await this.pubsub.publish('replicate', {
      kind: 'replicate',
      date: this.data[key].date.toISOString(),
      key,
      value: this.data[key].value
    })
  }

  public async start(): Promise<void> {
    await this.pubsub.subscribe('replicate', (msg) => this.onReplicate(msg))

    await this.pubsub.subscribe('replicateRequest', async (msg) => {
      if (msg.data.kind !== 'replicateRequest') return
      await Promise.all(Object.keys(this.data).map(this.replicate))
    })

    await this.pubsub.publish('replicateRequest', { kind: 'replicateRequest' })
  }

  public async stop(): Promise<void> {
    await this.pubsub.stop()
  }
}
