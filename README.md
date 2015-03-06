# gulp-domly [![NPM version][npm-image]][npm-url] [![Build status][travis-image]][travis-url]
> Plugin for gulp 3 to precompile [DOMly][domly] templates

## Usage

Install `gulp-domly` as a development dependency:

```shell
npm install --save-dev gulp-domly
```

## Compiling to a namespace for the browser

[gulp-declare] can be used to safely declare template namespaces and make templates available for use in the browser.

First, install development dependencies:

```shell
npm install --save-dev gulp-handlebars gulp-declare gulp-concat
```

Given the following directory structure:

```
├── gulpfile.js               # Your gulpfile
└── source/                   # Your application's source files
    └── templates/            # Templates named with dot notation
        └── app.html          # Delcared as MyApp.templates.app
        └── app.header.html   # Delcared as MyApp.templates.app.header
```

To compile all templates in `source/templates/` to `build/js/templates.js` under the `MyApp.templates` namespace:

#### gulpfile.js
```javascript
var domly = require('gulp-domly');
var declare = require('gulp-declare');
var concat = require('gulp-concat');

gulp.task('templates', function(){
  gulp.src(['source/templates/*.html'])
    .pipe(domly())
    .pipe(declare({
      namespace: 'MyApp.templates',
      noRedeclare: true, // Avoid duplicate declarations
    }))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest('build/js/'));
});
```

The template's filename is combined with the namespace, so the resulting `build/js/templates.js` would look like:

```js
this["MyApp"] = this["MyApp"] || {};
this["MyApp"]["templates"] = this["MyApp"]["templates"] || {};
this["MyApp"]["templates"]["app"] = function() { /* compiled */ };
this["MyApp"]["templates"]["app"] = this["MyApp"]["templates"]["app"] || {};
this["MyApp"]["templates"]["app"]["header"] = function() { /* compiled */ };
```

You can then use your templates:

```js
document.body.appendChild(MyApp.templates.app(data));
```

## Compiling to various module systems

See the [`gulp-define-module` documentation][gulp-define-module documentation] for details on how to define templates as AMD, Node, CommonJS, and hybrid modules.

First, install development dependencies:

```shell
npm install --save-dev gulp-handlebars gulp-define-module
```

To compile all templates in `source/templates/` to `build/js/templates/` as separate modules:

#### gulpfile.js
```javascript
var domly = require('gulp-domly');
var defineModule = require('gulp-define-module');

gulp.task('templates', function(){
  gulp.src(['source/templates/*.html'])
    .pipe(domly())
    .pipe(defineModule('amd'))
    .pipe(gulp.dest('build/js/templates/'));
});
```

## Passing compiler options

You can pass any compiler options accepted by [`domly.precompile()`][domly-precompile]:

#### gulpfile.js
```javascript
gulp.task('templates', function(){
  gulp.src(['source/templates/*.html'])
    .pipe(domly({
      compilerOptions: {
        stripWhitespace: true,
        preserveComments: true
      }  
    }))
    .pipe(defineModule('amd'))
    .pipe(gulp.dest('build/js/templates/'));
});
```

## Compiling using a specific DOMly version

You can use different versions of DOMly by specifying the version in your `package.json` and passing it as `options.domly`:

#### package.json
```json
{
  "devDependencies": {
    "domly": "^0.0.7"
  }
}
```

#### gulpfile.js
```js
gulp.task('templates', function(){
  gulp.src('source/templates/*.html')
    .pipe(domly({
      domly: require('domly')
    }))
    .pipe(defineModule('amd'))
    .pipe(gulp.dest('build/js/templates/'));
});
```


## API

### domly(options)

#### options.compilerOptions
Type: `Object`

Compiler options to pass to [`domly.precompile()`][domly-precompile].

#### options.domly
Type: `Object`  

DOMly library to use for precompilation. By default, the latest stable version of DOMly is used.


[travis-url]: http://travis-ci.org/lazd/gulp-domly
[travis-image]: https://secure.travis-ci.org/lazd/gulp-domly.png?branch=master
[npm-url]: https://npmjs.org/package/gulp-domly
[npm-image]: https://badge.fury.io/js/gulp-domly.png

[domly]: https://github.com/lazd/DOMly
[domly-precompile]: https://github.com/lazd/DOMly#domlyprecompiletemplate-options
[gulp-declare]: https://github.com/lazd/gulp-declare
[gulp-define-module documentation]: https://www.npmjs.com/package/gulp-define-module#type
[gulp-define-module]: https://www.npmjs.org/package/gulp-define-module
