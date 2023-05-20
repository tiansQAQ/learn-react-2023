const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  // 入口文件
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },

  // webpack 只能理解 JavaScript 和 JSON 文件，加载别的文件类型需要loader
  module: {
    rules: [
      // 使用babel-loader转换jsx
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      // 加载 CSS 文件
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          }
        ]
      }
    ]
  },
  // html-webpack-plugin 为应用程序生成一个 HTML 文件，并自动将生成的所有 bundle 注入到此文件中。
  plugins: [new HtmlWebpackPlugin({ template: './public/index.html' })],

  resolve: {
    // 别名
    alias: {
      '@': path.join(__dirname, 'src')
    }
  }
}
