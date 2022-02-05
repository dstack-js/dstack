---
title: PubSub
sidebar_position: 3
---

PubSub allows to publish and subscribe to events in topics

All events is serialized using `JSON.parse` / `JSON.stringify` methods

See [Peerchat](https://github.com/dstack-js/chat) demo

## Topic

Topics is a scope for event to happen, you can publish or subscribe to events in it

### Get available topics

```javascript
const { pubsub } = stack;
const topics = await pubsub.topics();

console.log(topics); // Example output: `['topic1', 'topic2']`
```

### Get peers count that subscribed to topic

```javascript
const { pubsub } = stack;
const count = await pubsub.peers('topic1');

console.log(topics); // Example output: 1
```

### Reserved topic prefixes

You cannot use `$$` at start of topic name, it is reserved for internal usage, for example for store replication.

Topics prefixed with `$$` will not be shown in available topics

## Subscribe

Receive event in topic

```javascript
const { pubsub } = stack;
pubsub.subscribe('topic1', (msg) => {
  console.log(msg.from, msg.data); // Example output: `somePeerId {hello: 'world'}`
});
```

### Unsubscribe

Will stop receiving events from topic

```javascript
const { pubsub } = stack;
pubsub.unsubscribe('topic1');
```

## Publish

Create event in topic

```javascript
const { pubsub } = stack;
pubsub.publish('topic1', { hello: 'world' });
```

Wait for peers to appear in topic before publish:

```javascript
const { pubsub } = stack;
pubsub.publish('topic1', { hello: 'world' }, false);
```

## Create sub-instance

All topics and events in it will be scoped to new instance

```javascript
const pubsub = stack.pubsub.create('sub-pubsub');
```
