module.exports = function(config) {
  config.set({
    browsers: ['PhantomJS'],
    frameworks: ['jasmine'],
    basePath: 'public/js',
    preprocessors: {
      '**/*.js': ['sourcemap']
    },
    files: ['**/*.js'],
    colors: true,
    reporters: ['mocha'],
  })
}
