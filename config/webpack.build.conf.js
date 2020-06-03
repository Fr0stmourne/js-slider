const merge = require('webpack-merge');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const baseWebpackConfig = require('./webpack.base.conf');

const build = merge.strategy({
  plugins: 'prepend',
})(baseWebpackConfig, {
  plugins: [new CleanWebpackPlugin()],
});

const buildWebpackConfig = merge(build, {
  mode: 'production',
  output: {
    publicPath: './',
  },
  optimization: {
    minimizer: [
      new OptimizeCssAssetsPlugin({
        cssProcessorPluginOptions: {
          preset: ['default', { discardComments: { removeAll: true } }],
        },
        canPrint: true,
      }),
      new TerserPlugin({
        parallel: true,
      }),
    ],
  },
  plugins: [
    new ImageminPlugin({ test: /\.(jpe?g|png|gif|svg)$/i }),
  ],
});

module.exports = new Promise(resolve => {
  resolve(buildWebpackConfig);
});
