# @dstack-js/transport

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/feross/standard)

[![](https://raw.githubusercontent.com/libp2p/interface-transport/master/img/badge.png)](https://github.com/libp2p/js-libp2p-interfaces/blob/master/packages/libp2p-interfaces/src/transport/README.md)
[![](https://raw.githubusercontent.com/libp2p/interface-connection/master/img/badge.png)](https://github.com/libp2p/js-libp2p-interfaces/blob/master/packages/libp2p-interfaces/src/connection/README.md)
[![](https://raw.githubusercontent.com/libp2p/interface-peer-discovery/master/img/badge.png)](https://github.com/libp2p/js-libp2p-interfaces/blob/master/packages/libp2p-interfaces/src/peer-discovery/README.md)

[Relay](https://dstack.dev/docs/relay) compatible libp2p transport with namespacing support

Forked from [libp2p/js-libp2p-webrtc-star](https://github.com/libp2p/js-libp2p-webrtc-star/blob/master/packages/webrtc-star-transport).

## Table of Contents <!-- omit in toc -->

- [@dstack-js/transport](#dstack-jstransport)
  - [Description](#description)
  - [Install](#install)
  - [Usage](#usage)
    - [Using this module in Node.js (read: not in the browser)](#using-this-module-in-nodejs-read-not-in-the-browser)
    - [Using this module in the Browser](#using-this-module-in-the-browser)
  - [API](#api)
    - [Transport](#transport)
    - [Connection](#connection)
    - [Peer Discovery - `ws.discovery`](#peer-discovery---wsdiscovery)

## Description

`@dstack-js/transport` is one of the WebRTC transports available for libp2p, made specifically to use with [DStack Relay](https://dstack.dev/docs/intro).

## Install

```bash
> npm install @dstack-js/transport
```

## Usage

### Using this module in Node.js (read: not in the browser)

To use this module in Node.js, you have to BYOI of WebRTC, there are multiple options out there, unfortunately, none of them are 100% solid. The one we recommend are: [@dstack-js/wrtc](http://npmjs.org/@dstack-js/wrtc).

Instead of just creating the WebRTCStar instance without arguments, you need to pass an options object with the WebRTC implementation:

```JavaScript
import wrtc from '@dstack-js/wrtc'
import electronWebRTC from 'electron-webrtc'
import { WebRTCStar } from '@dstack-js/transport'

// Using @dstack-js/wrtc
const ws1 = new WebRTCStar({ wrtc: wrtc, namespace: 'namespace' })

// Using electron-webrtc
const ws2 = new WebRTCStar({ wrtc: electronWebRTC(), namespace: 'namespace' })
```

### Using this module in the Browser

```JavaScript
import { WebRTCStar } from '@libp2p/webrtc-star'
import { Multiaddr } from '@dstack-js/transport'
import all from 'it-all'

const addr = multiaddr('/ip4/188.166.203.82/tcp/20000/wss/p2p-webrtc-star/p2p/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSooo2a')

const ws = new WebRTCStar({ upgrader, namespace: 'namespace' })

const listener = ws.createListener((socket) => {
  console.log('new connection opened')
  pipe(
    ['hello'],
    socket
  )
})

await listener.listen(addr)
console.log('listening')

const socket = await ws.dial(addr)
const values = await all(socket)

console.log(`Value: ${values.toString()}`)

// Close connection after reading
await listener.close()
```

## API

### Transport

[![](https://raw.githubusercontent.com/libp2p/interface-transport/master/img/badge.png)](https://github.com/libp2p/js-libp2p-interfaces/blob/master/packages/libp2p-interfaces/src/transport/README.md)

### Connection

[![](https://raw.githubusercontent.com/libp2p/interface-connection/master/img/badge.png)](https://github.com/libp2p/js-libp2p-interfaces/blob/master/packages/libp2p-interfaces/src/connection/README.md)

### Peer Discovery - `ws.discovery`

[![](https://raw.githubusercontent.com/libp2p/interface-peer-discovery/master/img/badge.png)](https://github.com/libp2p/js-libp2p-interfaces/blob/master/packages/libp2p-interfaces/src/peer-discovery/README.md)
