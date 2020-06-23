const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const glob = require('glob');

const PATHS = {
  src: path.join(__dirname, '../src'),
  dist: path.join(__dirname, '../dist'),
};

const PAGES = glob.sync(`${PATHS.src}/pages/**/*.html`);
const PAGE_SCRIPTS = glob.sync(`${PATHS.src}/pages/**/*.ts`);

function getEntrypoints(scripts) {
  const result = {};
  scripts.forEach(scriptPath => {
    const scriptName = scriptPath.slice(scriptPath.indexOf('src/pages'));
    const styleName = scriptName.replace(/\.ts/, '.scss');
    result[
      `${scriptPath
        .split('/')
        .slice(-1)[0]
        .replace(/\.ts/, '')}`
    ] = [`${__dirname}/../${scriptName}`, `${__dirname}/../${styleName}`];
  });

  return result;
}

module.exports = {
  // BASE config
  externals: {
    paths: PATHS,
    jquery: '$',
  },
  entry: {
    utils: [`${__dirname}/../src/utils/scaffoldings.scss`, `${__dirname}/../src/utils/fonts.scss`],
    plugin: `${__dirname}/../src/plugin/index.ts`,
    ...getEntrypoints(PAGE_SCRIPTS),
  },
  output: {
    filename: `[name].js`,
    path: PATHS.dist,
    publicPath: '/',
  },
  stats: {
    entrypoints: false,
    children: false,
  },
  optimization: {
    minimize: true,
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    plugins: [new TsconfigPathsPlugin({ configFile: './tsconfig.json' })],
  },
  mode: 'base',
  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: 'pug-loader',
      },
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
      },
      {
        test: /\.js$/,
        loader: this.mode === 'development' ? ['babel-loader', 'eslint-loader'] : 'babel-loader',
        exclude: '/node_modules/',
        include: path.resolve(__dirname, '../src'),
      },
      {
        test: /\.(jpeg|jpg|png|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          esModule: false,
          publicPath: './',
          outputPath: './',
        },
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          esModule: false,
        },
      },
      {
        test: /\.css$/,
        use: [this.mode === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.s(a|c)ss$/,
        use: [
          this.mode === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader?url=false',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              config: {
                path: `./postcss.config.js`,
              },
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin([{ from: `${PATHS.src}/images`, to: PATHS.dist }]),
    new MiniCssExtractPlugin({
      filename: `[name].css`,
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jquery: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      'window.$': 'jquery',
    }),
    ...PAGES.map(pagePath => {
      const pageName = pagePath.split('/').slice(-1)[0];
      return new HtmlWebpackPlugin({
        template: `${__dirname}/../${pagePath.slice(pagePath.indexOf('src/pages'))}`,
        hash: true,
        chunks: ['vendors', 'plugin', 'index'],
      });
    }),
  ],
};
