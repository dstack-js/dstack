import {
  booleanArg,
  enumType,
  intArg,
  list,
  nonNull,
  queryField,
  scalarType,
  stringArg
} from 'nexus'
import { getListenAddress } from './services/address'
import { getPeers } from './services/signaling/peer'

const Protocol = enumType({
  name: 'Protocol',
  members: ['http', 'https']
})

const MultiAddr = scalarType({
  name: 'MultiAddr',
  sourceType: 'String'
})

const listen = queryField('listen', {
  type: list('String'),
  description: 'Get addresses to listen on for libp2p',
  args: {
    protocol: nonNull(Protocol.asArg()),
    hostname: nonNull(stringArg()),
    port: nonNull(intArg())
  },
  resolve(_, { protocol, hostname, port }) {
    return [getListenAddress(protocol, hostname, port)]
  }
})

const namespace = queryField('namespace', {
  type: 'String',
  description: 'Stack namespace',
  resolve() {
    return process.env['NAMESPACE'] || 'dstack'
  }
})

const peers = queryField('peers', {
  type: list(MultiAddr),
  description:
    'Get addresses to bootstrap for IPFS, use `randomize` argument to get 3 random peers',
  args: {
    randomize: booleanArg()
  },
  async resolve(_, { randomize }) {
    const peers = await getPeers()

    if (randomize) {
      return peers
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)
        .slice(0, 3)
    }

    return peers
  }
})

export const types = [MultiAddr, Protocol, listen, peers, namespace]
