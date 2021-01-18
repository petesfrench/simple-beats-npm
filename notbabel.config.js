
module.exports = {
  plugins: [
      ["@babel/plugin-transform-modules-umd", {
      exactGlobals: true,
      globals: {
        index: 'Metronome'
      }
    }]
  ],
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],

  ],
  query: {
    presets: ['es2015']
}
};