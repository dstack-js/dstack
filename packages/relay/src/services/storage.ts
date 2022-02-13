import { Storage } from '@dstack-js/lib'
import { redis } from './cache'

export class RedisStorage<
  T = { value: string; date: Date }
> extends Storage<T> {
  constructor(override namespace: string) {
    super(namespace)
  }

  public override async set(key: string, value: T): Promise<void> {
    await redis.set(`${this.namespace}#${key}`, JSON.stringify(value))
  }

  public override async get(key: string): Promise<T | null> {
    const data = await redis.get(key)
    if (!data) return null

    return JSON.parse(data)
  }

  public override async keys(): Promise<string[]> {
    return redis.keys(`${this.namespace}#*`)
  }
}
