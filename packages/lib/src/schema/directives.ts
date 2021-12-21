import { mapSchema, getDirective, MapperKind } from '@graphql-tools/utils'
import { GraphQLSchema } from 'graphql/type'
import { IPFS } from 'ipfs-core'
import { resolveRecord, transformRecord } from './transform'

export const put = (ipfs: IPFS, directiveName = 'put') => {
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
              const ignoreCID = true

              if (originalResolve) {
                data = await originalResolve(source, arguments_, context, info)
              } else {
                data = source[info.fieldName]
                if (data.cid) {
                  source[info.fieldName] = data.cid.toString()
                }
              }

              if (!data.cid) {
                data = transformRecord(data, ignoreCID)

                const cid = await ipfs.dag.put(data)

                data = await resolveRecord(ipfs, data)

                data = { cid: cid.toString(), ...data }
              }

              return data
            }
          }

          return config
        }
      })
    }
  }
}
