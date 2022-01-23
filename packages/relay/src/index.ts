import { create } from '@dstack-js/ipfs'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { start } from 'libp2p-webrtc-star-signalling-server'

const run = async () => {
  if (!process.env['DNS_NAME']) {
    console.warn('no \'DNS_NAME\' env has been set, running in local mode')
  }

  await start({
    port: process.env['PORT'] || 9090,
    host: process.env['HOST'] || '0.0.0.0',
    metrics: !process.env['DISABLE_METRICS'] && true
  })

  const ipfs = await create({
    start: true,
    relay: {
      enabled: true,
      hop: {
        enabled: true,
        active: true
      },
    },
    config: {
      Addresses: {
        Swarm: [
          "/ip4/0.0.0.0/tcp/0",
          ...(process.env['DNS_NAME'] ? [`/dns4/${process.env['DNS_NAME']}/tcp/443/wss/p2p-webrtc-star`] : ['/dns4/localhost/tcp/9090/ws/p2p-webrtc-star/'])
        ]
      }
    }
  })

  console.log('Ready', await ipfs.config.get('Addresses.Swarm'))
}

run()
  .catch((error) => {
    console.error(error)
    process.exit(-1)
  })
