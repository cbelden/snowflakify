var path = require('path');
var Builder = require('systemjs-builder');

var builder = new Builder('./', './config.js');

builder
  .buildStatic('index.js', './dist/index.js')
  .then(function() {
    console.log('Build complete');
  })
  .catch(function(err) {
    console.log('Build error');
    console.log(err);
  });
