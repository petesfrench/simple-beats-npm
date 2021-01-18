const path = require('path');

module.exports = {
  entry: './metronome.js',
  // module: {
  //   rules: [
  //     {
  //       test: /\.(js)$/,
  //       include: path.resolve(__dirname, 'src'),
  //       exclude: /(node_modules|example|build)/,
  //       use: {
  //         loader: 'babel-loader',
  //         // options: {
  //         //   presets: ['@babel/preset-env']
  //         // }
  //       },
  //     },
  //   ],
  // },
  resolve: {
    extensions: ['.js'],
  },
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: 'metronome.js',
    library: 'getMetronome',
    libraryTarget: 'window'
  },
};