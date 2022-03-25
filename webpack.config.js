const webpack = require('webpack');
const { join } = require('path');

const nrwlConfig = require('@nrwl/react/plugins/webpack.js');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = (config) => {
  nrwlConfig(config);

  return {
    ...config,
    plugins: [
      ...config.plugins,
      new NodePolyfillPlugin(),
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
        process: 'process/browser',
      }),
      new CompressionPlugin(),
      // new BundleAnalyzerPlugin({ analyzerMode: 'static' })
    ],
    optimization: {
      mergeDuplicateChunks: true,
      minimize: true,
      moduleIds: 'size',
      nodeEnv: 'production',
    },
    resolve: {
      fallback: {
        util: require.resolve('util'),
        process: 'process/browser',
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
