import type { IPFS } from "ipfs-core"
import { Buffer } from "buffer"
import { CID } from "multiformats/cid"
import drain from "it-drain"

export interface Link {
  [name: string]: CID | undefined
}

export class Shard {
  private constructor(private ipfs: IPFS, public cid: CID, private storeContext?: { key: string; store: Store }) { }

  private static encode(data: any): Buffer {
    return Buffer.from(JSON.stringify(data), 'utf-8')
  }

  private static decode(data: Buffer | Uint8Array): any {
    return JSON.parse(data.toString('utf-8'))
  }

  public static async from(ipfs: IPFS, cid: CID, storeContext?: { key: string; store: Store }): Promise<Shard> {
    return new Shard(ipfs, cid, storeContext)
  }

  public static async create(ipfs: IPFS, data: any, storeContext?: { key: string; store: Store }): Promise<Shard> {
    const cid = await ipfs.object.put({ Data: Shard.encode(data), Links: [] })
    return new Shard(ipfs, cid, storeContext)
  }

  public async get(): Promise<any | null> {
    const pbNode = await this.ipfs.object.get(this.cid)
    if (!pbNode.Data) return null

    return Shard.decode(pbNode.Data)
  }

  private async refreshStore() {
    if (this.storeContext) {
      await this.storeContext.store.setDHT(this.storeContext.key, this.cid)
    }
  }

  public async set(data: any): Promise<void> {
    this.cid = await this.ipfs.object.patch.setData(this.cid, Shard.encode(data))

    await this.refreshStore()
  }

  public async links(): Promise<Link> {
    const links = await this.ipfs.object.links(this.cid)

    return Object.fromEntries(links.map(({ Name, Hash }) => [Name, Hash]))
  }

  public async addLink(name: string, cid: CID): Promise<void> {
    this.cid = await this.ipfs.object.patch.addLink(this.cid, {
      Name: name,
      Hash: cid
    })

    await this.refreshStore()
  }

  public async rmLink(cid: CID): Promise<void> {
    this.cid = await this.ipfs.object.patch.rmLink(this.cid, {
      Hash: cid
    })

    await this.refreshStore()
  }
}

export class Store {
  // TODO: LRU cache
  constructor(public ipfs: IPFS, public id: string, private keyCache: Record<string, CID> = {}) { }

  private getDHTKey(key: string): Buffer {
    return Buffer.from(`${this.id}/${key}`)
  }

  public async setDHT(key: string, value: CID): Promise<void> {
    await drain(this.ipfs.dht.put(this.getDHTKey(key), value.bytes, { minPeers: 0 } as any))
  }

  public async set(key: string, data: any): Promise<Shard> {
    const shard = await Shard.create(this.ipfs, data, { key, store: this })

    this.keyCache[key] = shard.cid
    await this.setDHT(key, shard.cid)

    return shard
  }

  public async get(key: string, timeout = 1000): Promise<Shard> {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise<Shard>(async (resolve, reject) => {
      const interval = setTimeout(() => reject('timeout'), timeout)

      for await (const event of this.ipfs.dht.get(this.getDHTKey(key))) {
        if (event.name === "VALUE") {
          clearTimeout(interval)

          const cid = CID.decode(event.value)
          this.keyCache[key] = cid

          resolve(Shard.from(this.ipfs, cid, { key, store: this }))
        }
      }
    })
  }
}
