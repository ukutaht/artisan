exports.config = {
  files: {
    javascripts: {
      joinTo: {
        'js/app.js': [/^app\/src\/js/, /^node_modules/],
        'js/test.js': [/^app\/test/, /^app\/src\/js/, /^node_modules/],
      }
    },
    stylesheets: {
      joinTo: 'css/app.css',
      order: {
        before: [
          'app/src/vendor/normalize.css'
        ]
      }
    }
  },

  conventions: {
    assets: /^(app\/src\/assets)/,
    vendor: /^(node_modules)/
  },

  paths: {
    watched: ['app/src', 'app/test'],
    public: 'app/public'
  },

  plugins: {
    babel: {
      presets: ['es2015', 'react']
    },
    eslint: {
      pattern: /^app\/src\/.*\.js?$/
    }
  },

  modules: {
    autoRequire: {
      'js/app.js': ['app'],
      'js/test.js': ['helpers/run-tests']
    },
    nameCleaner: (path) => {
      return path
        .replace(/^app\/src\/js\//, '')
        .replace(/^app\/test\//, '');
    }
  },
};
