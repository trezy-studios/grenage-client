const withSass = require('@zeit/next-sass')
const withWorkers = require('@zeit/next-workers')

const {
  FIREBASE_API_KEY,
  FIREBASE_PROJECT_ID,
  TWITCH_API_CLIENT_ID,
  TWITCH_API_URL,
} = process.env





module.exports = withWorkers(withSass({
  publicRuntimeConfig: {
    apis: {
      firebase: {
        apiKey: FIREBASE_API_KEY,
        authDomain: `${FIREBASE_PROJECT_ID}.firebaseapp.com`,
        databaseURL: `https://${FIREBASE_PROJECT_ID}.firebaseio.com`,
        projectId: FIREBASE_PROJECT_ID,
      },
      twitch: {
        clientID: TWITCH_API_CLIENT_ID,
        url: TWITCH_API_URL,
      },
    },
  },

  webpack: config => {
    config.module.rules.push({
      exclude: /node_modules/,
      test: /\.svg$/,
      loader: 'raw-loader',
    })

    return config
  },
}))
