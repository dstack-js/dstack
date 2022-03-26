import { Message, PubSub } from './pubsub'
import { Shard } from './shard'
import { Stack } from './stack'
import type { Storage } from './storage'

export interface ReplicateMessage {
  kind: 'replicate';
  key: string;
  value: string;
  date: string;
}

export interface ReplicateRequestMessage {
  kind: 'replicateRequest';
}

export type StackMessage = ReplicateMessage | ReplicateRequestMessage;

export class Store {
  private pubsub: PubSub<StackMessage>

  constructor(
    private stack: Stack,
    private storage: Storage,
    private loadOnReplicate: boolean = false
  ) {
    this.pubsub = stack.pubsub.create('$$store')
  }

  private async onReplicate(msg: Message<StackMessage>): Promise<void> {
    if (msg.data.kind !== 'replicate') return

    const local = await this.storage.get(msg.data.key)
    const date = new Date(msg.data.date)

    if (local?.date && local?.date > date) return

    await this.storage.set(msg.data.key, {
      value: msg.data.value,
      date
    })

    if (this.loadOnReplicate && msg.data.value.startsWith('/shard/')) {
      Shard.from(this.stack, msg.data.value)
        .then((shard) => {
          console.debug('shard replicated', shard)
        })
        .catch((err) => {
          console.warn('Failed to load on replicate', msg.data, err)
        })
    }
  }

  private watchShard(key: string, watch: Shard) {
    watch.on('update', async (shard): Promise<void> => {
      console.log(shard.toString())

      this.storage.set(key, {
        value: shard.toString(),
        date: new Date()
      })

      await this.replicate(key)
    })
  }

  public async get<TData = unknown>(key: string): Promise<Shard<TData> | null> {
    const local = await this.storage.get(key)

    if (!local) return null

    const shard = await Shard.from<TData>(this.stack, local.value)

    this.watchShard(key, shard)

    return shard
  }

  public async set<TData = unknown>(
    key: string,
    shard: Shard<TData>
  ): Promise<void> {
    await this.storage.set(key, {
      value: shard.toString(),
      date: new Date()
    })

    this.watchShard(key, shard)
    await this.replicate(key)
  }

  private async replicate(key: string): Promise<void> {
    const local = await this.storage.get(key)
    if (!local) return

    await this.pubsub.publish('replicate', {
      kind: 'replicate',
      date: local.date.toISOString(),
      key,
      value: local.value
    })
  }

  public async start(): Promise<void> {
    await this.pubsub.subscribe('replicate', (msg) => this.onReplicate(msg))

    await this.pubsub.subscribe('replicateRequest', async (msg) => {
      if (msg.data.kind !== 'replicateRequest') return
      const keys = await this.storage.keys()
      await Promise.all(keys.map((key) => this.replicate(key)))
    })

    await this.pubsub.publish('replicateRequest', { kind: 'replicateRequest' })
  }

  public async stop(): Promise<void> {
    await this.pubsub.stop()
  }
}
