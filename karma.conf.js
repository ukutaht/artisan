module.exports = function(config) {
  config.set({
    browsers: ['Chrome'],
    frameworks: ['jasmine'],
    basePath: 'priv/static/js',
    files: [
      'app.js',
      'test.js'
    ],
    preprocessors: {
      '**/*.js': ['sourcemap']
    },
    colors: true,
    reporters: ['mocha'],
    logLevel: config.LOG_WARN,

    junitReporter: {
      useBrowserName: false,
      outputFile: 'test-results.xml'
    }
  })
}
