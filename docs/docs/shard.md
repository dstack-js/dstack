---
title: Shard
sidebar_position: 2
---

Shard transforms your data into IPFS objects or blocks

## Creating

Shard can be binary or object

```typescript
import { Shard, ShardKind } from '@dstack-js/lib';
import { Buffer } from 'buffer';

const bufShard = await Shard.new<Buffer>(
  stack,
  ShardKind.Binary,
  Buffer.from('hello, world!')
);

const objShard = await Shard.new<{ hello: string }>(stack, ShardKind.Object, {
  hello: 'world',
});
```

## Sharing

You can get shard path and use in other nodes

```typescript
const shard = await Shard.new<Buffer>(
  stack,
  ShardKind.Binary,
  Buffer.from('hello, world!')
);

console.log(shard.toString()); // "/shard/..some..cid../binary"
```

```typescript
const shard = await Shard.from<Buffer>(stack, '/shard/..some..cid../binary');

console.log(shard.data.toString()); // "hello, world!"
```

## Putting a new value

```typescript
import { Shard, ShardKind } from '@dstack-js/lib';
import { Buffer } from 'buffer';

const shard = await Shard.new<Buffer>(
  stack,
  ShardKind.Binary,
  Buffer.from('hello, world!')
);

await shard.put(Buffer.from('hello, dstack!'));
```

## Events

### Data update

```typescript
shard.put({ hello: 'dstack' });

shard.on('update', (shard) => {
  console.log(shard.data); // {"hello": "dstack"}
});
```
