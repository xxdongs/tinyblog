const path = require('path')
const resolve = dir => {
  return path.join(__dirname, dir)
}

module.exports = {
  outputDir: 'dist',
  productionSourceMap: true,

  devServer: {
    port: 3001,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3000',
        // target: 'back:3000',
        changeOrigin: true,
      },
    },
  },
  // pages: {
  //   index: {
  //     entry: 'src/pages/index/index.js',
  //     template: 'src/pages/index/index.html',
  //     filename: 'index.html',
  //     chunks: ['chunk-vendors', 'chunk-common', 'index']
  //   },
  //   admin: {
  //     entry: 'src/pages/admin/index.js',
  //     template: 'src/pages/admin/index.html',
  //     filename: 'admin.html',
  //     chunks: ['chunk-vendors', 'chunk-common', 'admin']
  //   },
  // },
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
  },
}

