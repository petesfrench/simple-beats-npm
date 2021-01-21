const path = require('path');

module.exports = {
  entry: './metronome.js',
  mode: 'production',
  resolve: {
    extensions: ['.js, .ts'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: 'metronome.ts',
    library: 'Metronome',
    libraryExport: 'default',
    libraryTarget: 'umd'
  },
};