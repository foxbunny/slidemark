/**
 * (c) 2017 Hajime Yamasaki Vukelic
 * All rights reserved.
 */

const path = require('path')

const autoprefixer = require('autoprefixer')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer')

module.exports = env => {
  const commonPlugins = [
    new webpack.DefinePlugin({
      ROUTE_PREFIX: JSON.stringify(env && env.prefix || ''),
    }),
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, 'static/index.html'),
    }),
    new ExtractTextPlugin({
      allChunks: true,
      filename: '[name]-[contenthash].css',
    }),
  ]

  const plugins = process.env.NODE_ENV === 'production'
    // Production plugins
    ? commonPlugins.concat([

    ])
    // Development plugins
    : commonPlugins.concat([
      new webpack.NamedModulesPlugin(),
    ])

  if (env && env.profile === 'yes') {
    plugins.push(new BundleAnalyzerPlugin({
      analyzerMode: 'server',
    }))
  }

  return {
    devServer: {
      disableHostCheck: true,
      historyApiFallback: true,
      overlay: true,
    },
    devtool: 'source-map',
    entry: {
      shell: ((env && env.devtool === 'yes'
        ? ['duckweed-devtool']
        : []
      ).concat(
        './src'
      )),
    },
    module: {
      rules: [
        // JS and JSX code
        {
          test: /.jsx?$/,
          use: 'babel-loader',
        },

        // Stylesheets
        {
          test: /.styl$/,
          use: ExtractTextPlugin.extract({
            fallback: {
              loader: 'style-loader',
              options: {
                sourceMap: true,
              },
            },
            use: [
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 1,
                  localIdentName: '[local]-[hash:base64:5]',
                  modules: true,
                  sourceMap: true,
                },
              },
              {
                loader: 'postcss-loader',
                options: {
                  plugins: [autoprefixer()],
                  sourceMap: true,
                },
              },
              {
                loader: 'stylus-loader',
              },
            ],
          }),
        },

        // Markdown files
        {
          test: /\.md$/,
          use: [
            './loaders/slide-loader',
          ],
        },

        // SVG and images
        {
          test: /\.(svg|png|jpg)$/,
          use: 'url-loader',
        },
      ],
    },
    output: {
      filename: '[name]-[hash:5].js',
      path: path.resolve(__dirname, 'build'),
    },
    plugins,
    resolve: {
      modules: [
        path.resolve(__dirname, 'src'),
        path.resolve(__dirname, '.'),
        'node_modules',
      ],
    },
  }
}
