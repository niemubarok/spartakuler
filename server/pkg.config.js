module.exports = {
  hooks: {
    'post-package': (context) => {
      // Add any post-package operations here
    }
  },
  assets: [
    'node_modules/axios/**/*.js',
    'node_modules/sharp/**/*'
  ],
  ignore: [
    'node_modules/sqlite3/deps/**/*'
  ],
  outputPath: 'dist',
  targets: ['latest-win-x64'],
  compressed: true
}