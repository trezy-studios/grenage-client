const ElectronStore = new (require('electron-store'))()
const fs = require('fs')
const path = require('path')
const withCSS = require('@zeit/next-css')
const withWorkers = require('@zeit/next-workers')





// Local constants
const keymapsPath = path.resolve(__dirname, '..', 'keymaps')
const keymapOverrides = ElectronStore.get('keymaps') || {}





module.exports = withWorkers(withCSS({
  exportPathMap () {
    return {
      '/game': {
        page: '/game',
      },
    }
  },

  publicRuntimeConfig: {
    keymaps: fs.readdirSync(keymapsPath).reduce((accumulator, filename) => {
      const keymap = JSON.parse(fs.readFileSync(path.resolve(keymapsPath, filename), 'utf8'))

      for (const gamepadID of keymap.ids) {
        accumulator[gamepadID] = {
          ...keymap.map,
          ...(keymapOverrides[gamepadID] || {}),
        }
      }

      return accumulator
    }, {}),
  },

  webpack: config => {
    config.target = 'electron-renderer'
    config.module.rules.push({
      exclude: /node_modules/,
      test: /\.svg$/,
      loader: 'raw-loader',
    })

    return config
  },
}))
