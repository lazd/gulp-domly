# gulp-domly [![NPM version][npm-image]][npm-url] [![Build status][travis-image]][travis-url]
> DOMly plugin for gulp 3

## Usage

First, install `gulp-domly` as a development dependency:

```shell
npm install --save-dev gulp-domly
```

Then, add it to your `gulpfile.js`:

```javascript
var domly = require('gulp-domly');

gulp.task('templates', function(){
  gulp.src(['client/templates/*.html'])
    .pipe(domly({
      outputType: 'node'
    }))
    .pipe(gulp.dest('build/templates/'));
});
```

## Compiling to a namespace for the browser

[gulp-declare] can be used to compile templates for the browser. Just pipe the output of `gulp-domly` to `gulp-declare`:

```javascript
var domly = require('gulp-domly');
var declare = require('gulp-declare');

gulp.task('templates', function(){
  gulp.src(['client/templates/*.html'])
    .pipe(domly())
    .pipe(declare({
      namespace: 'MyApp.templates'
    }))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest('build/js/'));
});
```


## API

### domly(options)

#### options.outputType
Type: `String`  
Default: `bare`

The desired output type. One of the following:

* `node` - Produce Node modules
* `amd` - Produce AMD modules
* `commonjs` - Produce CommonJS modules
* `bare` - Return an unmolested function definition

#### options.compilerOptions
Type: `Object`

Compiler options to pass to `domly.precompile()`.


[travis-url]: http://travis-ci.org/lazd/gulp-domly
[travis-image]: https://secure.travis-ci.org/lazd/gulp-domly.png?branch=master
[npm-url]: https://npmjs.org/package/gulp-domly
[npm-image]: https://badge.fury.io/js/gulp-domly.png

[gulp-declare]: https://github.com/lazd/gulp-declare
