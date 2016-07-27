exports.config = {
  files: {
    javascripts: {
      joinTo: {
        'js/app.js': [/^app\/src\/js/, /^node_modules/],
        'js/test.js': [/^app\/test/],
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
    public: 'priv/static'
  },

  plugins: {
    babel: {
      presets: ['es2015', 'react']
    },
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

  overrides: {
    production: {
      paths: {
        watched: ['app/src'],
      },
      files: {
        javascripts: {
          joinTo: {},
          entryPoints: {
            'app/src/js/app.js': 'js/app.js',
          },
        }
      }
    }
  }
};
