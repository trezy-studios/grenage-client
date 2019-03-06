const path = require('path')





module.exports = {
  plugins: {
    // Illustrational
    'postcss-easy-import': {},
    'postcss-for': {},
    'postcss-functions': {
      glob: path.join(__dirname, 'styles', 'functions', '*.js'),
    },
    'postcss-nested': {},
    'postcss-preset-env': {},
  }
}