window.require.list()
  .filter(function(name) {return /-test.js$/.test(name);})
  .forEach(require);
