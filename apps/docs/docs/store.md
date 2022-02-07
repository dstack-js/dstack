---
title: Store
sidebar_position: 1
---

Store provides possibility to store [Shards](shard) bound to keys

Also store replicates shards/keys to the peers in same stack namespace

## Setting value

By providing shard:

```typescript
const shard = await Shard.new<{ hello: string }>(stack, ShardKind.Object, {
  hello: 'world',
});

await stack.store.set('hello', shard);
```

## Getting value

```typescript
const shard = await stack.store.get<{ hello: string }>('hello');

console.log(shard.data); // {"hello": "world"}
```

## Watching for a new value

```typescript
const shard = await stack.store.get<{ hello: string }>('hello');

shard.put({ hello: 'dstack' });

shard.on('update', (shard) => {
  console.log(shard.data); // {"hello": "dstack"}
});
```

See [Shard](shard) to get more possibilities

[shard]: /docs/shard
