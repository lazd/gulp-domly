var atmlPlugin = require('../');
var should = require('should');
var gutil = require('gulp-util');
var os = require('os');
var fs = require('fs');
var path = require('path');
require('mocha');

var getFixture = function(filePath) {
  filePath = path.join('test', 'fixtures', filePath);
  return new gutil.File({
    path: filePath,
    cwd: path.join('test', 'fixtures'),
    base: path.dirname(filePath),
    contents: fs.readFileSync(filePath)
  });
};

var getExpectedString = function(filePath) {
  return fs.readFileSync(path.join('test', 'expected', filePath), 'utf8');
};

var fileMatchesExpected = function(file, fixtureFilename) {
  path.basename(file.path).should.equal('Basic.js');
  String(file.contents).should.equal(getExpectedString(fixtureFilename));
};

describe('gulp-atml', function() {
  describe('atmlPlugin()', function() {

    it('should throw on invalid input type', function() {
      (function() {
        atmlPlugin({
          outputType: 'cow'
        });
      }).should.throw();
    });

    it('should emit an error when compiling invalid templates', function(done) {
      var stream = atmlPlugin({
        outputType: 'bare'
      });

      var invalidTemplate = getFixture('Invalid.html');
      
      stream.on('error', function(err) {
        err.should.be.an.instanceOf(Error);
        err.message.should.equal(getExpectedString('Syntax_error.txt'));
        done();
      });

      stream.write(invalidTemplate);
      stream.end();
    });

    it('should compile bare templates', function(done) {
      var stream = atmlPlugin({
        outputType: 'bare'
      });

      var basicTemplate = getFixture('Basic.html');

      stream.on('data', function(newFile) {
        should.exist(newFile);
        should.exist(newFile.contents);
        fileMatchesExpected(newFile, 'Basic_bare.js');
        done();
      });
      stream.write(basicTemplate);
      stream.end();
    });

    it('should compile multiple bare templates', function(done) {
      var stream = atmlPlugin({
        outputType: 'bare'
      });

      var basicTemplate = getFixture('Basic.html');
      var basicTemplate2 = getFixture('Basic.html');

      var count = 0;
      stream.on('data', function(newFile) {
        should.exist(newFile);
        should.exist(newFile.contents);
        fileMatchesExpected(newFile, 'Basic_bare.js');

        count++;
        if (count === 2) {
          done();
        }
      });
      stream.write(basicTemplate);
      stream.write(basicTemplate2);
      stream.end();
    });

    it('should compile templates for AMD', function(done) {
      var stream = atmlPlugin({
        outputType: 'amd'
      });

      var basicTemplate = getFixture('Basic.html');

      stream.on('data', function(newFile) {
        should.exist(newFile);
        should.exist(newFile.contents);
        fileMatchesExpected(newFile, 'Basic_amd.js');
        done();
      });
      stream.write(basicTemplate);
      stream.end();
    });

    it('should compile templates for CommonJS', function(done) {
      var stream = atmlPlugin({
        outputType: 'commonjs'
      });

      var basicTemplate = getFixture('Basic.html');

      stream.on('data', function(newFile) {
        should.exist(newFile);
        should.exist(newFile.contents);
        fileMatchesExpected(newFile, 'Basic_commonjs.js');
        done();
      });
      stream.write(basicTemplate);
      stream.end();
    });

    it('should compile templates for Node', function(done) {
      var stream = atmlPlugin({
        outputType: 'node'
      });

      var basicTemplate = getFixture('Basic.html');

      stream.on('data', function(newFile) {
        should.exist(newFile);
        should.exist(newFile.contents);
        fileMatchesExpected(newFile, 'Basic_node.js');
        done();
      });
      stream.write(basicTemplate);
      stream.end();
    });

  });
});
