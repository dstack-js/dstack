/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IPFS } from "ipfs-core"
import { Buffer } from "buffer"
import { CID } from "multiformats/cid"
import drain from "it-drain"
import LRUCache, { Options as LRUOptions } from "lru-cache"
import { PubSub } from "./pubsub"

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
  private cache: LRUCache<string, CID>

  constructor(public ipfs: IPFS, public namespace: string, private pubsub: PubSub, cache: LRUOptions<string, CID> = { max: 1000000, maxAge: 1000 }) {
    this.cache = new LRUCache(cache)
  }

  public async start() {
    await this.pubsub.subscribe('$store', (msg) => {
      const { key, value } = msg.data as { key: string; value: string }
      this.cache.set(key, CID.parse(value))
    })

    await this.pubsub.handleRequest('$store.get', ([key], reply) => {
      const value = this.cache.get(key)
      if (value) {
        reply(value.toString())
      }
    })
  }

  private getDHTKey(key: string): Buffer {
    return Buffer.from(`${this.namespace}/${key}`)
  }

  public async emitUpdate(key: string, value: CID): Promise<void> {
    await Promise.all([
      drain(this.ipfs.dht.put(this.getDHTKey(key), value.bytes, { minPeers: 0 } as any)),
      this.pubsub.publish('$store', { key, value: value.toString() })
    ])
  }

  public async set<T = any>(key: string, data: T): Promise<Shard<T>> {
    const shard = await Shard.create(this.ipfs, data, { namespace: key, store: this })

    this.cache.set(key, shard.cid)
    await this.emitUpdate(key, shard.cid).catch(console.warn)

    return shard
  }

  public async getFromDHT<T = any>(key: string, timeout = 1000): Promise<Shard<T>> {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise<Shard>(async (resolve, reject) => {
      const cached = this.cache.get(key)
      if (cached) return resolve(Shard.from(this.ipfs, cached, { namespace: key, store: this }))

      const interval = setTimeout(() => reject('timeout'), timeout)

      for await (const event of this.ipfs.dht.get(this.getDHTKey(key))) {
        if (event.name === "VALUE") {
          clearTimeout(interval)

          const cid = CID.decode(event.value)
          this.cache.set(key, cid)

          resolve(Shard.from(this.ipfs, cid, { namespace: key, store: this }))
        }
      }
    })
  }

  public async getFromPubSub<T = any>(key: string, timeout = 1000): Promise<Shard<T>> {
    const value = await this.pubsub.request('$store.get', [key], timeout)

    return Shard.from(this.ipfs, CID.parse(value), { namespace: key, store: this })
  }

  public async get<T = any>(key: string, timeout = 1000): Promise<Shard<T>> {
    return Promise.race([
      this.getFromPubSub(key, timeout),
      this.getFromDHT(key, timeout)
    ])
  }
}
