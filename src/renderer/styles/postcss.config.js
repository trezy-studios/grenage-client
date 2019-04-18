const path = require('path')





module.exports = {
  exec: true,
  plugins: {
    'postcss-easy-import': {},
    'postcss-for': {},
    'postcss-functions': {
      glob: path.join(__dirname, 'styles', 'functions', '*.js'),
    },
    'postcss-nested': {},
    'postcss-color-function': {},
    'postcss-preset-env': {},
  },
}
