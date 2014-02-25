var map = require('vinyl-map');
var es = require('event-stream');
var rename = require('gulp-rename');
var atml = require('atml');
var extend = require('xtend');

var outputTypes = ['amd', 'commonjs', 'node', 'bare'];

module.exports = function(options) {
  options = extend({
    compilerOptions: {},
    outputType: 'bare' // amd, commonjs, node, bare
  }, options);

  if (outputTypes.indexOf(options.outputType) === -1) {
    throw new Error('Invalid output type: '+options.outputType);
  }

  var compileHandlebars = function(contents, path) {
    // Perform pre-compilation
    // This will throw if errors are encountered
    var compiled = atml.precompile(contents.toString(), options.compilerOptions);

    // Handle different output times
    if (options.outputType === 'amd') {
      compiled = "define(function() {return "+compiled+";});";
    }
    else if (options.outputType === 'commonjs') {
      compiled = "module.exports = function() {return "+compiled+";};";
    }
    else if (options.outputType === 'node') {
      compiled = "module.exports = "+compiled+";";
    }

    return compiled;
  };

  var doRename = function(dir, base, ext) {
    // Change the extension to .js
    return base+'.js';
  };

  return es.pipeline(
    map(compileHandlebars),
    rename(doRename)
  );
};
