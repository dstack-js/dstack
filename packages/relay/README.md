# @dstack-js/relay

Relay provides IPFS peer with [`libp2p-webrtc-star`](https://github.com/libp2p/js-libp2p-webrtc-star) signaling server

## Public relay

PeerId - `QmV2uXBKbii29iJKHKVy8sx5m49qdDTBYNybVoa5uLJtrf`

Signaling - `/dns4/dstack-relay.herokuapp.com/tcp/443/wss/p2p-webrtc-star/`

Bootstrap - `['/dns4/dstack-relay.herokuapp.com/tcp/443/wss/p2p-webrtc-star/p2p/QmV2uXBKbii29iJKHKVy8sx5m49qdDTBYNybVoa5uLJtrf']`


## Using predefined peer id

Generate peer id private key using [`peer-id`](https://www.npmjs.com/package/peer-id) package

```javascript
const PeerId = require('peer-id');

const id = await PeerId.create({ bits: 1024, keyType: 'RSA' });
console.log(JSON.stringify(id.toJSON(), null, 2));
```

```json
{
  "id": "Qma9T5YraSnpRDZqRR4krcSJabThc8nwZuJV3LercPHufi",
  "privKey": "CAAS4AQwggJcAgEAAoGBAMBgbIqyOL26oV3nGPBYrdpbv..",
  "pubKey": "CAASogEwgZ8wDQYJKoZIhvcNAQEBBQADgY0AMIGJAoGBAMBgbIqyOL26oV3nGPBYrdpbvzCY..."
}
```

or generate [in browser](https://codepen.io/0x77dev/pen/JjrgQoe)

Then you can store `privKey` in `PRIVATE_KEY` environment key
