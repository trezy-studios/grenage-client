module.exports = async env => {
  const rendererConfig = await webpackRenderer(env)

  // console.log(rendererConfig.plugins)

  // rendererConfig.module.rules.unshift({
  //   // enforce: 'pre',
  //   test: /\.css$/,
  //   use: [
  //     // 'style-loader',
  //     // {
  //     //   loader: 'css-loader',
  //     //   options: { importLoaders: 1 },
  //     // },
  //     {
  //       loader: 'postcss-loader',
  //       options: {},
  //     },
  //   ],
  // })

  return rendererConfig
}
