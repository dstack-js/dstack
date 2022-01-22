import { create } from '@dstack-js/ipfs'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { start } from 'libp2p-webrtc-star-signalling-server'

const run = async () => {
  if (!process.env['DNS_NAME']) {
    throw new Error('no \'DNS_NAME\' env has been set')
  }

  await start({
    port: process.env['PORT'] || 9090,
    host: process.env['HOST'] || '0.0.0.0',
    metrics: !process.env['DISABLE_METRICS'] && true
  })

  const ipfs = await create({
    config: {
      Addresses: {
        Swarm: [`/dns4/${process.env['DNS_NAME']}/tcp/443/wss/p2p-webrtc-star`]
      }
    }
  })

  const id = await ipfs.id()

  console.log('IPFS ready', id.addresses.map((m) => m.toString()).join('\n\t'))
}

run()
  .catch((error) => {
    console.error(error)
    process.exit(-1)
  })
