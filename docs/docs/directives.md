---
sidebar_position: 2
---

# Directives

## [`@put`](http://localhost:3000/docs/api/modules#put)

will store object in dag and injects `cid` key into resolver root value

```graphql
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
```
