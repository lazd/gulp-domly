var through2 = require('through2');
var gutil = require('gulp-util');

const PLUGIN_NAME = 'gulp-domly';

module.exports = function(options) {
  'use strict';

  options = options || {};
  var compilerOptions = options.compilerOptions || {};
  var domly = options.domly || require('domly');

  var compileDOMly = function(file, enc, callback) {
    if (file.isStream()) {
      this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
      return callback();
    }
    else if (file.isBuffer()) {
      var compiled = null;
      try {
        // Perform pre-compilation
        // This will throw if errors are encountered
        compiled = domly.precompile(file.contents.toString(), options.compilerOptions);
      }
      catch (err) {
        this.emit('error', new gutil.PluginError(PLUGIN_NAME, err, {
          fileName: file.path
        }));
        return callback();
      }

      file.contents = new Buffer(compiled);
      file.path = gutil.replaceExtension(file.path, '.js');
    }

    callback(null, file);
  };

  return through2.obj(compileDOMly);
};
