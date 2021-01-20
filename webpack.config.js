const path = require('path');

module.exports = {
  entry: './metronome.js',
  mode: 'production',
  resolve: {
    extensions: ['.js'],
  },
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: 'metronome.js',
    library: 'Metronome',
    libraryExport: 'default',
    libraryTarget: 'umd'
  },
};