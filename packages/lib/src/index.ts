import { makeExecutableSchema, IExecutableSchemaDefinition } from '@graphql-tools/schema'
import { create, IPFS } from 'ipfs-core'
import { GraphQLSchema, GraphQLArgs, graphql } from 'graphql'
import { put } from './schema/directives'
import { cid } from './schema/scalars'

export interface StackOptions<TContext = any> {
  schema: IExecutableSchemaDefinition<TContext>
}

export type ExecuteArguments = Omit<GraphQLArgs, 'schema'>

export interface Stack {
  schema: GraphQLSchema
  execute: (arguments_: ExecuteArguments) => ReturnType<typeof graphql>
  context: {
    ipfs: IPFS
  }
  stop: () => Promise<void>
}

export const createStack = async (options: StackOptions): Promise<Stack> => {
  const ipfs = await create({ EXPERIMENTAL: { sharding: true, ipnsPubsub: true } })
  const directives = await Promise.all([put(ipfs)])
  options.schema.typeDefs = `scalar CID\n${options.schema.typeDefs}`

  if (options.schema.resolvers) {
    options.schema.resolvers = {
      CID: cid,
      ...options.schema.resolvers
    }
  }

  for (const directive of directives) {
    options.schema.typeDefs = `${directive.typeDefs}\n${options.schema.typeDefs.toString()}`
  }

  let schema = makeExecutableSchema(options.schema)

  schema = directives.reduce<typeof schema>(
    (previous, current): typeof schema => {
      return current.transformer(previous)
    },
    schema)

  return {
    schema,
    execute: (arguments_) => {
      return graphql({ ...arguments_, schema })
    },
    context: { ipfs },
    stop: async () => {
      await ipfs.stop()
    }
  }
}

export * from './schema/directives'
export * from './schema/transform'
export * from './schema/scalars'
