---
title: Stack
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Stack is facade that provides provides IPFS and Relay communications for components such as Storage, PubSub and etc...

## Create

<Tabs>
  <TabItem value="public-relay" label="Public Relay">

```javascript
import { Stack } from '@dstack-js/lib';

const stack = await Stack.create({
  namespace: 'namespace',
});

console.log('My Peer ID is:', stack.id);
```

  </TabItem>
  <TabItem value="custom-relay" label="Custom Relay">

```javascript
import { Stack } from '@dstack-js/lib';

const stack = await Stack.create({
  namespace: 'namespace',
  relay: 'https://relay.dstack.dev:443/graphql',
});

console.log('My Peer ID is:', stack.id);
```

  </TabItem>

  <TabItem value="non-browser" label="Non-browser environment">

```javascript
import { Stack } from '@dstack-js/lib';
import wrtc from '@dstack-js/wrtc';

const stack = await Stack.create({
  namespace: 'namespace',
  wrtc,
});

console.log('My Peer ID is:', stack.id);
```

  </TabItem>
</Tabs>

## Identity

### Providing private key

```javascript
import { Stack } from '@dstack-js/lib';

const privateKey = '...';

const stack = await Stack.create({
  namespace: 'namespace',
  privateKey,
});

console.log('My Peer ID is:', stack.id);
```

You can generate a private key using [`peer-id`](https://www.npmjs.com/package/peer-id) module.

### Peer object

```javascript
{
  id: "peerId",
  address: "/some/address"
}
```

### Get my identity

```javascript
const peer = await stack.id();
console.log(peer.id, peer.address);
```

## Connectivity

No need to connect peers manually, DStack will handle it by itself

if you want to ensure that some peers is connected

### Connect to peer manually

```javascript
await stack.connect('/some/addr');
```

### Get connected Peers

```javascript
const peers = await stack.peers();
```

### Events

#### `onPeerConnect`

```javascript
stack.onPeerConnect((peer) => console.log(peer.id, peer.address));
```

#### `onPeerDisconnected`

```javascript
stack.onPeerDisconnected((peer) => console.log(peer.id, peer.address));
```

### Ping

Get round trip time to the connected peer

```javascript
const [peer] = await stack.peers();
const ms = await stack.ping(peer);
console.log(ms, 'ms'); // Example output: `8.1 ms`
```

Specify timeout:

```javascript
const [peer] = await stack.peers();
// timeout in ms
const ms = await stack.ping(peer, { timeout: 10000 });
console.log(ms, 'ms');
```

Specify cycles count:

```javascript
const [peer] = await stack.peers();
const ms = await stack.ping(peer, { count: 1 });
console.log(ms, 'ms');
```

## Gracefully stop

```javascript
await stack.stop();
```
