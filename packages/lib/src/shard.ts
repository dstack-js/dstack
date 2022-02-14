/* eslint-disable no-dupe-class-members */
import { CID } from 'multiformats/cid'
import { Buffer } from 'buffer'
import { UnknownShardKindError } from './errors'
import { EventEmitter } from 'events'
import { Stack } from './stack'
import { InvalidShardPathError } from '.'
import all from 'it-all'

export enum ShardKind {
  // eslint-disable-next-line no-unused-vars
  Binary = 'binary',
  // eslint-disable-next-line no-unused-vars
  Object = 'object',
}

const toUint8Array = (buf: Buffer): Uint8Array => {
  const a = new Uint8Array(buf.length)
  for (let i = 0; i < buf.length; i++) a[i] = buf[i]
  return a
}

export class Shard<
  TData extends Buffer | Record<string, any> = Buffer | Record<string, any>
> {
  private events = new EventEmitter()

  private constructor(
    public stack: Stack,
    public cid: CID,
    public kind: ShardKind,
    public data: TData
  ) {}

  public async put(data: TData): Promise<void> {
    switch (this.kind) {
      case ShardKind.Binary:
        this.cid = (
          await this.stack.ipfs.add(toUint8Array(data as Buffer))
        ).cid
        break
      case ShardKind.Object:
        this.cid = await this.stack.ipfs.dag.put(data)
        break
      default:
        throw new UnknownShardKindError()
    }

    this.events.emit('update', this)
  }

  public on(event: 'update', listener: (shard: Shard<TData>) => void): void {
    this.events.on(event, listener)
  }

  public static async new<TData = unknown>(
    stack: Stack,
    kind: ShardKind,
    data: TData
  ): Promise<Shard<TData>> {
    const cid: CID = await stack.ipfs.dag.put({ empty: true })

    const shard = new Shard<TData>(stack, cid, kind, data)
    shard.put(data)

    return shard
  }

  public static async create<TData = Buffer | Record<string, any>>(
    stack: Stack,
    cid: CID,
    kind: ShardKind
  ): Promise<Shard<TData>> {
    let data

    if (ShardKind.Binary) {
      const u8 = await all(stack.ipfs.cat(cid))
      data = Buffer.from(u8)
    }

    if (ShardKind.Object) {
      data = (await stack.ipfs.dag.get(cid)).value
    }

    return new Shard(stack, cid, kind, data)
  }

  public static from<TData = Buffer | Record<string, any>>(
    stack: Stack,
    path: string
  ): Promise<Shard<TData>> {
    // eslint-disable-next-line no-unused-vars
    const [_, shard, cid, kind] = path.split('/')

    if (shard !== 'shard') {
      throw new InvalidShardPathError()
    }

    try {
      return Shard.create(stack, CID.parse(cid), kind as ShardKind)
    } catch (error) {
      throw new InvalidShardPathError(error)
    }
  }

  public toString(): string {
    return `/shard/${this.cid.toString()}/${this.kind}`
  }
}
