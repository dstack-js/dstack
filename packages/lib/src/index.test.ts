/* eslint-disable no-undef */
import { Stack, createStack } from '.'
import { graphql } from 'graphql'

const typeDefs = `
type Post {
  cid: ID!
  title: String!
  content: String!
}

type Mutation {
  addPost: Post! @add
}

type Query {
  post(cid: ID!): Post! @get
}
`

const resolvers = {
  Mutation: {
    addPost: () => ({ title: 'Hello', content: 'World!' })
  },
  Query: {
    post: (_: unknown, { cid }: { cid: string }) => ({ cid })
  }
}

describe('Stack', () => {
  let stack: Stack
  let cid: string

  beforeAll(async () => {
    stack = await createStack({ schema: { typeDefs, resolvers } })
  })

  test('add', async () => {
    const { data, errors } = await graphql({ schema: stack.schema, source: 'mutation { addPost { cid title content } }' })
    expect(errors).toBeFalsy()
    expect((data as any).addPost.cid).toBeTruthy()
    cid = (data as any).addPost.cid
  })

  test('get', async () => {
    const { data, errors } = await graphql({
      schema: stack.schema,
      source: 'query Post($cid: ID!) { post(cid: $cid) { cid title content } }',
      variableValues: { cid }
    })

    expect(errors).toBeFalsy()
    expect((data as any).post.cid).toBe(cid)
    expect((data as any).post.title).toBe('Hello')
    expect((data as any).post.content).toBe('World!')
  })

  afterAll(async () => {
    await stack.stop()
  })
})
