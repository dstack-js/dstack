import { Stack } from '@dstack-js/lib'
import { createServer, Server } from 'node:http'

export const initRelay = (
  app: string | undefined = process.env.APP,
  port: string | number = process.env.PORT || 1024,
  server?: Server
): { stack: Stack, server: Server } => {
  if (!server) server = createServer().listen(port)
  const stack = new Stack({ app, gun: { web: server } })
  console.log('Listening on', port)

  return { stack, server }
}
