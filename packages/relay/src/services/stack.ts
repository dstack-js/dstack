import { join } from 'path'
import { Stack, Storage } from '@dstack-js/lib'
// @ts-expect-error: no-types
import wrtc from '@dstack-js/wrtc'
import LRUCache from 'lru-cache'
import { tmpdir } from 'os'
import { redis } from './cache'

export class RedisStorage<T = { value: string; date: Date }>
implements Storage<T> {
  private prefix: string

  constructor(public namespace: string) {
    this.prefix = `s!${this.namespace}#`
  }

  public async set(key: string, value: T): Promise<void> {
    await redis.set(`${this.prefix}${key}`, JSON.stringify(value))
    redis.expire(`${this.prefix}${key}`, 3600)
  }

  public async get(key: string): Promise<T | null> {
    const data = await redis.get(key)
    if (!data) return null

    return JSON.parse(data)
  }

  public async keys(): Promise<string[]> {
    const keys = await redis.keys(`${this.prefix}*`)
    return keys.map((key) => key.replace(this.prefix, ''))
  }
}

const cache = new LRUCache<string, 'allocating' | Stack>({
  ttl: 60000,
  ttlAutopurge: true,
  updateAgeOnGet: true,
  dispose: async (stack, namespace) => {
    if (stack === 'allocating') return

    await stack
      .stop()
      .then(() => {
        console.log(namespace, 'stack deallocated')
      })
      .catch((error) => {
        console.warn(
          'error happened while deallocation stack in',
          namespace,
          error
        )
      })
  }
})

export const getStack = async (namespace: string) => {
  let stack = cache.get(namespace)

  if (!stack) {
    try {
      cache.set(namespace, 'allocating')
      stack = await Stack.create({
        namespace,
        wrtc,
        relay: `http://127.0.0.1:${process.env['PORT'] || 13579}/graphql`,
        repo: join(tmpdir(), '.dstack', namespace),
        storage: new RedisStorage(namespace)
      })

      cache.set(namespace, stack)
      console.log(namespace, 'stack allocated')

      return stack
    } catch (error) {
      console.warn(
        'error happened while allocation stack in',
        namespace,
        error
      )
      throw error
    }
  }

  if (stack === 'allocating') return null

  return stack
}
