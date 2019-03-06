const withCSS = require('@zeit/next-css')
const withWorkers = require('@zeit/next-workers')

module.exports = withWorkers(withCSS({
  webpack: config => {
    config.target = 'electron-renderer'
    config.module.rules.push({
      exclude: /node_modules/,
      test: /\.svg$/,
      loader: 'raw-loader',
    })

    return config
  },

  exportPathMap () {
    return {
      '/game': {
        page: '/game',
      },
    }
  },
}))
