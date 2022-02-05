---
title: Stack
sidebar_position: 1
---

## Identity

### Peer object

```javascript
{
  id: "peerId",
  address: "/some/address"
}
```

### Get my information

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

Will terminate pubsub events and store replication

Also you can stop IPFS:

```javascript
await stack.stop();
await stack.ipfs.stop();
```
