exports.config = {
  files: {
    javascripts: {
      joinTo: {
        'js/app.js': [/^src\/js/, /^node_modules/],
        'js/test.js': [/^test/, /^src\/js/, /^node_modules/],
      }
    },
    stylesheets: {
      joinTo: 'css/app.css',
      order: {
        before: [
          'src/vendor/normalize.css'
        ]
      }
    }
  },

  conventions: {
    assets: /^(src\/assets)/,
    vendor: /^(node_modules)/
  },

  paths: {
    watched: ['src', 'test'],
    public: 'public'
  },

  plugins: {
    babel: {
      presets: ['es2015', 'react']
    },
    eslint: {
      pattern: /^src\/.*\.js?$/
    }
  },

  modules: {
    autoRequire: {
      'js/app.js': ['app'],
      'js/test.js': ['helpers/run-tests']
    },
    nameCleaner: (path) => {
      return path
        .replace(/^src\/js\//, '')
        .replace(/^test\//, '');
    }
  },

  server: {
    port: 4001,
  }
};
