import { GraphQLScalarType } from 'graphql/type'
import { CID } from 'multiformats/cid'

export const cid: GraphQLScalarType = new GraphQLScalarType<any>({
  name: 'CID',

  serialize(value: any) {
    return CID.parse(value)
  },

  parseValue(value: any) {
    if (value instanceof CID) {
      return value.toString()
    }

    return value
  },

  parseLiteral(ast) {
    return cid.parseLiteral(ast, {})
  }
})
