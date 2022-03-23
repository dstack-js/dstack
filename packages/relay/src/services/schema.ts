import { makeSchema } from 'nexus'
import { join } from 'path'
import { types } from '../types'

export const getSchema = (outputs = process.env['GENERATE'] !== 'false') => {
  return makeSchema({
    types,
    contextType: {
      module: join(__dirname, '../interfaces.ts'),
      export: 'Context'
    },
    outputs: outputs
      ? {
          schema: join(__dirname, 'generated/schema.graphql'),
          typegen: join(__dirname, 'generated/types.d.ts')
        }
      : {}
  })
}
