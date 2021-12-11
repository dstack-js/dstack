import { mapSchema, getDirective, MapperKind } from '@graphql-tools/utils'
import { GraphQLSchema } from 'graphql'
import { IPFS } from 'ipfs-core'
import { CID } from 'multiformats'

export const add = (ipfs: IPFS, directiveName = 'add') => {
  return {
    typeDefs: `directive @${directiveName} on FIELD_DEFINITION`,
    transformer: (schema: GraphQLSchema) => {
      return mapSchema(schema, {
        [MapperKind.OBJECT_FIELD]: (config) => {
          const directive = getDirective(schema, config, directiveName)?.[0]

          if (directive) {
            const originalResolve = config.resolve

            config.resolve = async function (source, arguments_, context, info) {
              let data: any = {}

              if (originalResolve) {
                data = await originalResolve(source, arguments_, context, info)
              }

              const cid = await ipfs.dag.put(data)
              data.cid = cid.toString()

              return data
            }
          }

          return config
        }
      })
    }
  }
}

export const get = (ipfs: IPFS, directiveName = 'get') => {
  return {
    typeDefs: `directive @${directiveName} on FIELD_DEFINITION`,
    transformer: (schema: GraphQLSchema) => {
      return mapSchema(schema, {
        [MapperKind.OBJECT_FIELD]: (config) => {
          const directive = getDirective(schema, config, directiveName)?.[0]

          if (directive) {
            const originalResolve = config.resolve

            config.resolve = async function (source, arguments_, context, info) {
              let data: any = {}

              if (originalResolve) {
                data = await originalResolve(source, arguments_, context, info)
              }

              if (!data.cid) {
                throw new Error('cid could not be found')
              }

              const cid = CID.parse(data.cid)

              const result = await ipfs.dag.get(cid)

              data = { cid: cid.toString(), ...result.value }

              return data
            }
          }

          return config
        }
      })
    }
  }
}
