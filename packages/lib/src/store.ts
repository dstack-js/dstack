/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IPFS } from 'ipfs-core'
import { Buffer } from 'buffer'
import { CID } from 'multiformats/cid'
import { PubSub } from './pubsub'

export interface Link {
  [name: string]: CID | undefined
}

export class Shard<T = any> {
  private constructor(private ipfs: IPFS, public cid: CID, private context?: { namespace: string; store: Store }) { }

  private static encode<T = any>(data: T): Buffer {
    return Buffer.from(JSON.stringify(data), 'utf-8')
  }

  private static decode<T = any>(data: Buffer | Uint8Array): T {
    return JSON.parse(data.toString('utf-8'))
  }

  public static async from<T = any>(ipfs: IPFS, cid: CID, context?: { namespace: string; store: Store }): Promise<Shard<T>> {
    return new Shard<T>(ipfs, cid, context)
  }

  public static async create<T = any>(ipfs: IPFS, data: T, context?: { namespace: string; store: Store }): Promise<Shard<T>> {
    const cid = await ipfs.object.put({ Data: Shard.encode(data), Links: [] })
    return new Shard<T>(ipfs, cid, context)
  }

  public async get(): Promise<T | null> {
    const pbNode = await this.ipfs.object.get(this.cid)
    if (!pbNode.Data) return null

    return Shard.decode(pbNode.Data)
  }

  private async refreshStore() {
    if (this.context) {
      await this.context.store.emitUpdate(this.context.namespace, this.cid)
    }
  }

  public async set(data: T): Promise<void> {
    this.cid = await this.ipfs.object.patch.setData(this.cid, Shard.encode(data))

    await this.refreshStore()
  }

  /**
   * **Links are EXPERIMENTAL**
   */
  public async links(): Promise<Link> {
    const links = await this.ipfs.object.links(this.cid)

    return Object.fromEntries(links.map(({ Name, Hash }) => [Name, Hash]))
  }

  /**
   * **Links are EXPERIMENTAL**
   */
  public async addLink(name: string, cid: CID): Promise<void> {
    this.cid = await this.ipfs.object.patch.addLink(this.cid, {
      Name: name,
      Hash: cid
    })

    await this.refreshStore()
  }

  /**
   * **Links are EXPERIMENTAL**
   */
  public async rmLink(cid: CID): Promise<void> {
    this.cid = await this.ipfs.object.patch.rmLink(this.cid, {
      Hash: cid
    })

    await this.refreshStore()
  }
}

export class Store {
  private map: { [key: string]: CID } = {}

  constructor(public ipfs: IPFS, public namespace: string, private pubsub: PubSub) { }

  public async start() {
    await this.pubsub.subscribe('$store', (msg) => {
      const { key, value } = msg.data as { key: string; value: string }
      this.map[key] = CID.parse(value)
    })

    await this.pubsub.subscribe('$store.lookup', async (msg) => {
      const { key } = msg.data as { key: string }
      const value = this.map[key]

      if (value) {
        await this.pubsub.publish('$store', { key, value: value.toString() })
        await this.pubsub.publish(`$store.${key}`, { key, value: value.toString() })
      }
    })
  }

  public async emitUpdate(key: string, value: CID): Promise<void> {
    this.map[key] = value
    await this.pubsub.publish('$store', { key, value: value.toString() })
  }

  /**
   * Set data to store
   *
   * @param key key
   * @param data value
   * @returns Shard
   */
  public async set<T = any>(key: string, data: T): Promise<Shard<T>> {
    const shard = await Shard.create(this.ipfs, data, { namespace: key, store: this })

    this.map[key] = shard.cid
    await this.emitUpdate(key, shard.cid)

    return shard
  }

  /**
   * Get data from Store by key
   *
   * @param key key
   * @param timeout in ms
   * @returns Shard
   */
  public async get<T = any>(key: string, timeout = 2000): Promise<Shard<T> | void> {
    const value = this.map[key]
    if (value) return Shard.from(this.ipfs, value, { namespace: key, store: this })

    const peers = await this.pubsub.peers('$store.lookup')

    if (!peers) {
      console.warn('While trying to get', key, 'no peers was found to ask for a value')
      return
    }

    // eslint-disable-next-line no-async-promise-executor
    return new Promise<Shard<T> | void>(async (resolve) => {
      await this.pubsub.subscribe(`$store.${key}`, (msg) => {
        const data = msg.data as { key: string; value: string }

        resolve(Shard.from(this.ipfs, CID.parse(data.value), { namespace: key, store: this }))
      })

      await this.pubsub.subscribe('$store', (msg) => {
        const data = msg.data as { key: string; value: string }

        if (data.key === key) {
          resolve(Shard.from(this.ipfs, CID.parse(data.value), { namespace: key, store: this }))
        }
      })

      await this.pubsub.publish('$store.lookup', { key })

      setTimeout(() => {
        console.warn('While trying to get', key, 'timeout happened')
        resolve()
      }, timeout)
    })
  }
}
