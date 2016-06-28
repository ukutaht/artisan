exports.config = {
  files: {
    javascripts: {
      joinTo: "js/app.js"
    },
    stylesheets: {
      joinTo: "css/app.css"
    }
  },

  conventions: {
    assets: /^(src\/assets)/
  },

  paths: {
    watched: ["src"],
    public: "public"
  },

  plugins: {
    babel: {
      presets: ["es2015", "react"]
    },
    eslint: {
      pattern: /^src\/.*\.js?$/,
      warnOnly: false
    }
  },

  modules: {
    autoRequire: {
      "js/app.js": ["src/js/app"]
    }
  },
};
