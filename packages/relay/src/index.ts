import { RelayContext } from './interfaces'
import fastify from 'fastify'
import fastifyCors from 'fastify-cors'
import { setSocket } from './services/signaling'
import mercurius from 'mercurius'
import { GraphQLSchema } from 'graphql'
import { setPlayground } from './playgroud'
import { setMetrics } from './services/metrics'
import { getSchema } from './services/schema'

export interface ListenOptions {
  host?: string;
  port?: number | string;
}

export const listen = async ({
  port = process.env['PORT'] || 13579,
  host = process.env['HOST'] || '0.0.0.0'
}: ListenOptions = {}) => {
  const server = fastify({ logger: true })

  setSocket(server)
  setMetrics(server)
  setPlayground(server)
  server.register(fastifyCors, { origin: '*' })
  server.register(mercurius, {
    // TODO: fix types
    schema: getSchema() as unknown as GraphQLSchema,
    context: (req): RelayContext => {
      return {
        namespace: req.headers['X-DStack-Namespace'] as string | undefined
      }
    },
    path: '/graphql'
  })

  const address = await server.listen(port, host)
  console.log('Listening on', address)
}
