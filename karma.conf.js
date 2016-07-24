module.exports = function(config) {
  config.set({
    browsers: ['Chrome'],
    frameworks: ['jasmine'],
    basePath: 'priv/static/js',
    preprocessors: {
      '**/*.js': ['sourcemap']
    },
    files: ['**/*.js'],
    colors: true,
    reporters: ['mocha'],

    junitReporter: {
      useBrowserName: false,
      outputFile: 'test-results.xml'
    }
  })
}
