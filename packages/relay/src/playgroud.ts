import type { FastifyInstance } from 'fastify'
import { renderPlaygroundPage } from 'graphql-playground-html'

const endpoint = '/graphql'

export const setPlayground = (fastify: FastifyInstance) => {
  fastify.get('/', (req, res) => {
    let [host, port] = req.headers['host']
      ? req.headers['host'].split(':')
      : [process.env['HOST'] || '0.0.0.0', process.env['PORT'] || '13579']

    if (!port) port = '443'

    res.header('Content-Type', 'text/html')
    res.send(
      renderPlaygroundPage({
        endpoint,
        title: 'DStack Relay GraphQL Playground',
        settings: {
          'tracing.tracingSupported': false
        },
        tabs: [
          {
            name: 'Get Listen Addresses',
            query: `query {\n  listen(protocol: ${
              port === '443' ? 'https' : 'http'
            }, hostname: "${host}", port: ${port})\n}`,
            endpoint
          }
        ]
      })
    )
  })
}
