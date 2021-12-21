---
sidebar_position: 3
---

# Scalars

## [`CID`](http://localhost:3000/docs/api/modules#cid)

will transform `string` into [`CID`](https://github.com/multiformats/cid)


```graphql
type Mutation {
  addPost(content: String!, author: CID!): Post! @put
}
```
