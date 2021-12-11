import { makeExecutableSchema, IExecutableSchemaDefinition } from '@graphql-tools/schema'
import { create } from 'ipfs-core'
import { GraphQLSchema } from 'graphql'
import { add, get } from './schema/directives'

export interface StackOptions<TContext = any> {
  schema: IExecutableSchemaDefinition<TContext>
}

export interface Stack {
  schema: GraphQLSchema
  stop: () => Promise<void>
}

export const createStack = async (options: StackOptions): Promise<Stack> => {
  const ipfs = await create({ EXPERIMENTAL: { sharding: true, ipnsPubsub: true } })
  const directives = await Promise.all([add(ipfs), get(ipfs)])

  for (const directive of directives) {
    options.schema.typeDefs = `${directive.typeDefs}\n${options.schema.typeDefs.toString()}`
  }

  let schema = makeExecutableSchema(options.schema)
  schema = directives.reduce<typeof schema>((previous, current): typeof schema => {
    return current.transformer(previous)
  }, schema)

  return {
    schema,
    stop: async () => {
      await ipfs.stop()
    }
  }
}
