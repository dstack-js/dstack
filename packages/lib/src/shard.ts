/* eslint-disable no-dupe-class-members */
import { CID } from 'ipfs-core'
import { Buffer } from 'buffer'
import { UnknownShardKindError } from './errors'
import { EventEmitter } from 'events'
import { Stack } from './stack'
import { InvalidShardPathError } from '.'
import type { IPFS } from 'ipfs-core'

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

type Data = Buffer | Record<string, any>;

const createCID = async (
  data: Data,
  kind: ShardKind,
  ipfs: IPFS
): Promise<CID> => {
  if (kind === ShardKind.Binary) {
    const file = await ipfs.add(toUint8Array(data as Buffer))
    return file.cid
  }

  if (kind === ShardKind.Object) {
    return ipfs.dag.put(data)
  }

  throw new UnknownShardKindError()
}

export class Shard<TData extends Data = Data> {
  private events = new EventEmitter()

  private constructor(
    public stack: Stack,
    public cid: CID,
    public kind: ShardKind,
    public data: TData
  ) {}

  public async put(data: TData): Promise<void> {
    this.cid = await createCID(data, this.kind, this.stack.ipfs)
    this.events.emit('update', this)
  }

  public on(event: 'update', listener: (shard: Shard<TData>) => void): void {
    this.events.on(event, listener)
  }

  public static async new<TData extends Data>(
    stack: Stack,
    kind: ShardKind,
    data: TData
  ): Promise<Shard<TData>> {
    return new Shard<TData>(
      stack,
      await createCID(data as TData, kind, stack.ipfs),
      kind,
      data
    )
  }

  public static async create<TData extends Data>(
    stack: Stack,
    cid: CID,
    kind: ShardKind
  ): Promise<Shard<TData>> {
    let data

    if (kind === ShardKind.Binary) {
      data = Buffer.from('')

      for await (const chunk of stack.ipfs.cat(cid)) {
        data = Buffer.concat([data, Buffer.from(chunk)])
      }
    } else if (kind === ShardKind.Object) {
      data = (await stack.ipfs.dag.get(cid)).value
    }

    return new Shard(stack, cid, kind, data)
  }

  public static from<TData extends Data>(
    stack: Stack,
    path: string
  ): Promise<Shard<TData>> {
    const [shard, cid, kind] = path.split('/').slice(-3)

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
