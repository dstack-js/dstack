/* eslint-disable no-undef */

import { Stack, createStack } from '.'
import faker from 'faker'
import { CID } from 'multiformats'

const typeDefs = /* GraphQL */ `
type Author {
  cid: ID!
  name: String!
}

type Post {
  cid: ID!
  content: String!
  author: Author! @d
}

type Mutation {
  addPost(content: String!, author: CID!): Post! @d
  addAuthor(name: String): Author! @d
}

type Query {
  post(cid: ID!): Post! @d
}
`

describe('Stack', () => {
  let stack: Stack

  beforeAll(async () => {
    stack = await createStack({
      schema: {
        typeDefs,
        resolvers: {
          Mutation: {
            addPost: (root: void, data: unknown) => data,
            addAuthor: (root: void, data: unknown) => data
          },
          Query: {
            post: (root: void, data: unknown) => data
          }
        }
      }
    })
  })

  const addAuthor = async () => {
    const name = faker.name.firstName()

    const { errors, data } = await stack.execute({
      source: /* GraphQL */ `
        mutation AddAuthor($name: String!) {
          addAuthor(name: $name) {
            cid
            name
          }
        }
      `,
      variableValues: { name }
    })

    console.log(errors, data)
    expect(errors).toBeFalsy()
    expect(CID.parse((data as any).addAuthor.cid)).toBeTruthy()
    expect((data as any).addAuthor.name).toBe(name)

    return (data as any).addAuthor.cid as string
  }

  const addPost = async (author: string) => {
    const content = faker.lorem.sentences()

    const { errors, data } = await stack.execute({
      source: /* GraphQL */ `
        mutation AddPost($author: CID!, $content: String!) {
          addPost(content: $content, author: $author) {
            cid
            content
            author {
              cid
              name
            }
          }
        }
      `,
      variableValues: { content, author }
    })

    console.log(errors, data)
    expect(errors).toBeFalsy()
    expect(CID.parse((data as any).addPost.cid)).toBeTruthy()
    expect((data as any).addPost.content).toBe(content)
  }

  test('put', async () => {
    const author = await addAuthor()
    await addPost(author)
  })
})
