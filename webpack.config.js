const nrwlConfig = require('@nrwl/react/plugins/webpack.js');
const { join } = require('path');

module.exports = (config, context) => {
  nrwlConfig(config);

  return {
    ...config,
    resolve: {
      fallback: {
        util: require.resolve('util'),
        '@dstack-js/lib': join(__dirname, 'dist', 'packages', 'lib'),
        '@dstack-js/ipfs': join(__dirname, 'dist', 'packages', 'ipfs'),
        '@dstack-js/transport': join(
          __dirname,
          'dist',
          'packages',
          'transport'
        ),
      },
    },
  };
};
