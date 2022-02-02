/* eslint-disable @typescript-eslint/no-var-requires */
import { create } from '@dstack-js/ipfs';
import { Stack } from '@dstack-js/lib';

const wrtc = require('wrtc');
const { start } = require('libp2p-webrtc-star-signalling-server');

const run = async () => {
  if (!process.env['DNS_NAME']) {
    console.warn("no 'DNS_NAME' env has been set, running in local mode");
  }

  await start({
    port: process.env['PORT'] || 9090,
    host: process.env['HOST'] || '0.0.0.0',
    metrics: !process.env['DISABLE_METRICS'] && true,
  });

  if (process.env['NAMESPACE']) {
    const ipfs = await create(
      {
        start: true,
        ...(process.env['PRIVATE_KEY']
          ? { init: { privateKey: process.env['PRIVATE_KEY'] } }
          : {}),
        relay: {
          enabled: true,
          hop: {
            enabled: true,
            active: true,
          },
        },
      },
      wrtc
    );

    await Stack.create(process.env['NAMESPACE'], ipfs);
  }

  console.log('ready');
};

run().catch((error) => {
  console.error(error);
  process.exit(-1);
});
