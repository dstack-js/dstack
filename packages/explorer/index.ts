import Fastify from 'fastify'
import mercurius from 'mercurius'
import { createStack } from '@dstack-js/lib'
import { CID } from 'multiformats/cid'

const typeDefs = `
type Author {
  cid: ID!
  name: String!
}

type Post {
  cid: ID!
  author: Author! @d
  name: String!
  content: String!
}

type Mutation {
  addPost(authorCID: ID!, name: String, content: String!): Post! @d
  addAuthor: Author! @d
}

type Query {
  post(cid: ID!): Post! @d
}
`

const resolvers = {
  Mutation: {
    addPost: (_: void, { authorCID, name, content }: {name: string; content: string; authorCID: string}) => ({ name, content, author: { cid: CID.parse(authorCID) } }),
    addAuthor: () => ({ name: 'Test' })
  },
  Query: {
    post: (_: unknown, { cid }: { cid: string }) => ({ cid })
  }
}

const run = async () => {
  const stack = await createStack({ schema: { typeDefs, resolvers } })
  const fastify = Fastify()

  fastify.register(mercurius, {
    schema: stack.schema as any,
    graphiql: true
  })

  const address = await fastify.listen(process.env.PORT || 1024)
  console.log(address)
}

run()
