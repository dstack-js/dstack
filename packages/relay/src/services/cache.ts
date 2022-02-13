import { createClient } from 'redis'

export const redis = createClient({
  url: process.env['REDIS_URL'] || 'redis://localhost:6379'
})
export const publisher = redis.duplicate()
export const subscriber = redis.duplicate()

const instances = [redis, publisher, subscriber]

instances.forEach((redis) => {
  redis.on('error', console.error)
  redis.connect()
})
