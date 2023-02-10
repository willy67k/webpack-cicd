const path = require('path')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack')
// const WebSocket = require('ws')

const devMode = process.env.NODE_ENV !== 'production'

module.exports = {
  mode: 'development',
  // devtool: 'eval-cheap-module-source-map',
  devtool: 'nosources-source-map',
  resolve: {
    alias: {
      '@image': path.resolve(__dirname, 'src/img')
    }
  },
  entry: {
    main: './src/main.js',
    contact: './src/contact.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].js'
  },
  plugins: [
    new CleanWebpackPlugin,
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      chunks: ['main'], // 僅包含名為 main 的 chunk
      // hash: true, //  会在打包好的bundle.js或抽离的.css文件后加hash串
      inject: true, //是否能注入内容到输入的页面去
      // minify: {
      //   removeComments: true, //移除HTML中的注释
      //   collapseWhitespace: true, //删除空白符与换行符，整个文件会压成一行
      // }
    }),
    new HtmlWebpackPlugin({
      template: './src/contact.html',
      filename: 'contact.html',
      chunks: ['contact'], // 僅包含名為 contact 的 chunk
    }),
    new MiniCssExtractPlugin({
      // filename: 'css/[name].[hash:3].css'
      filename: 'css/[name].css', 
      // for HMR, do not use [hash]. See issue [https://github.com/webpack/webpack-dev-server/issues/3064]
      // MiniCssExtractPlugin & style-loader already support HMR, so you don't have to manipulate sass-loader or postcss-loader config.
    }),
    // new webpack.HotModuleReplacementPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'img', // 打包後的資料夾名稱
              limit: 8192, // 單位 byte
              fallback: require.resolve('file-loader'),
            }
          }
        ]
      },

      {
        test: /\.s[ac]ss$/i,
        use: [
          // devMode? 'style-loader' : MiniCssExtractPlugin.loader,
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              // modules: true,
              // url: false,
              sourceMap: true, // 開啟 sourcemap 支持
            }
          },
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true, // 開啟 sourcemap 支持
            },
          },
        ]
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader'
        }
      }
    ],
  },
  // optimization: {
  //   // runtimeChunk: 'multiple', // or true
  //   runtimeChunk: {
  //     name: 'maiifest' // runtime 文件名稱為 manifest.js
  //   },
  //   splitChunks: {
  //     // chunks: 'async',
  //     // minSize: 3000,
  //     // maxSize: 0,
  //     // minChunks: 1,
  //     // maxAsyncRequests: 6,
  //     // maxInitialRequests: 4,
  //     // automaticNameDelimiter: '~',
  //     cacheGroups: {
  //       vendors: {
  //         test: /[\\/]node_modules[\\/]/,
  //         chunks: 'initial',
  //         name: 'vendors',
  //         enforce: true,
  //         priority: 20,
  //       },
  //       common: {
  //         chunks: 'initial',
  //         minSize: 0,
  //         name: 'common',
  //         minChunks: 2,
  //         priority: 10,
  //       },
  //       // default: {
  //       //   minChunks: 2,
  //       //   priority: -20,
  //       //   reuseExistingChunk: true,
  //       // },
  //     },
  //   }
  // },
  devServer: {
    hot: true, // open Hot Module Replacement mode
    // port: 80,
    // host: '0.0.0.0',
    compress: true,
    // publicPath: '/',
    // static: [
    //   path.resolve(__dirname, 'dist'),
    //   {
    //     watch: true
    //   }
    // ],
    // ipc: true,
    static: {
      directory: path.resolve(__dirname, "dist"),
      // publicPath: "/static-public-path/",
      watch: true,
    },
    webSocketServer: "ws",
    client: {
      webSocketURL: 'ws://0.0.0.0/ws', // 使用於非https之websocket, 預設是使用 'wss://0.0.0.0/ws'
    },
    allowedHosts: 'all',
  }
}