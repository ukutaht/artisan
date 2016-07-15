exports.config = {
  files: {
    javascripts: {
      joinTo: {
        'js/app.js': [/^src\/js/, /^node_modules/],
        'js/test.js': [/^test/, /^node_modules/],
      }
    },
    stylesheets: {
      joinTo: 'css/app.css'
    }
  },

  conventions: {
    assets: /^(src\/assets)/,
    vendor: /^(node_modules|test)/
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
      'js/app.js': ['app']
    },
    nameCleaner: (path) => {
      return path.replace(/^src\/js\//, '');
    }
  },
};
