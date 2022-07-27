const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: {
    "amazon-connect-wisdomjs": [
      path.resolve(__dirname, 'src/bundle.ts'),
      path.resolve(__dirname, 'src/index.ts'),
    ],
    "amazon-connect-wisdomjs-min": [
      path.resolve(__dirname, 'src/bundle.ts'),
      path.resolve(__dirname, 'src/index.ts'),
    ],
  },
  output: {
    path: path.resolve(__dirname, 'release'),
    filename: '[name].js',
    library: {
      name: 'WisdomJS',
      type: 'umd',
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts)$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts'],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        include: /-min\.js/,
      }),
    ],
  },
};
