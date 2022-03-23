import fastify from 'fastify'
import fastifyCors from 'fastify-cors'
import { setSocket } from './services/signaling'
import { makeSchema } from 'nexus'
import mercurius from 'mercurius'
import { types } from './types'
import { GraphQLSchema } from 'graphql'
import path from 'path'
import { setPlayground } from './playgroud'
import { setMetrics } from './services/metrics'

export interface ListenOptions {
  namespace?: string;
  listenOn?: string;
  host?: string;
  port?: number | string;
}

export const listen = async ({
  port = process.env['PORT'] || 13579,
  host = process.env['HOST'] || '0.0.0.0'
}: ListenOptions = {}) => {
  const server = fastify({ logger: true })
  const schema = makeSchema({
    types,
    outputs: {
      schema: path.join(__dirname, 'generated/schema.graphql'),
      typegen: path.join(__dirname, 'generated/types.d.ts')
    }
  })

  setSocket(server)
  setMetrics(server)
  setPlayground(server)
  server.register(fastifyCors, { origin: '*' })
  server.register(mercurius, {
    // TODO: fix types
    schema: schema as unknown as GraphQLSchema,
    path: '/graphql'
  })

  const address = await server.listen(port, host)
  console.log('Listening on', address)
}
