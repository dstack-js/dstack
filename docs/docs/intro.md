---
sidebar_position: 1
---

# Quick Look

Let's discover **DStack in less than 15 minutes**.

## Add DStack to your project

Using Yarn:
```shell
yarn add @dstack-js/lib
```

Using NPM:
```shell
npm i -S @dstack-js/lib
```

### Create stack
```javascript
import { createStack } from '@dstack-js/lib'

const typeDefs = /* GraphQL */ `
type Author {
  cid: ID!
  name: String!
}

type Post {
  cid: ID!
  content: String!
  author: Author! @put
}

type Mutation {
  addPost(content: String!, author: CID!): Post! @put
  addAuthor(name: String): Author! @put
}

type Query {
  post(cid: ID!): Post! @put
}
`

const stack = await createStack({
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
```

_**See [directives](/docs/directives) and [scalars](/docs/scalars)**_

### Execute
```javascript
const { errors, data: { addAuthor } } = await stack.execute({
  source: /* GraphQL */ `
    mutation AddAuthor($name: String!) {
      addAuthor(name: $name) {
        cid
        name
      }
    }
  `,
  variableValues: { name: 'John Doe' }
})

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
  variableValues: { content: 'Hello, world!', author: addAuthor }
})
```


_**See [API](/docs/api)**_
