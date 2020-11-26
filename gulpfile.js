/*--------------------------- GULPFILE  ----------------------------
    Bayliss Wagner

    Tasks: browser-sync, nunjucks, browserifyTask, watcher, default
---------------------------------------------------------------------- */
'use strict';
var gulp = require('gulp');
var nunjucksRender = require('gulp-nunjucks-render');
var browserSync = require('browser-sync').create();
//var runSequence = require('run-sequence');
var sass = require('gulp-sass');


/*--------------------------- NUNJUCKS ----------------------------
Fill HTML files in the 'app/pages/' directory with templates and
partials, then output finished files to the root directory.

#TODO make a separate build task that will output to the root, then
change this so that it only outputs to the app/ folder
---------------------------------------------------------------------- */
gulp.task('nunjucks', function() {
  // Gets .html and .nunjucks files in pages
  return gulp.src('app/pages/*.+(html|nunjucks)') //all nunjucks code will be replaced
  // Renders template with nunjucks
  .pipe(nunjucksRender({
      path: ['app/templates'] //super helpful: tells nunjucks to look in templates folder when rendering
    }))
  // output files in root directory
  .pipe(gulp.dest('.'))
});


/*--------------------------- BROWSERSYNC ----------------------------
BrowserSync serves my HTML, CSS and JS files for me
by opening a socket between my browser and a server.
It syncs the page I'm seeing on the browser with
any recent file changes, so i can see a CSS change onscreen
as soon as i change the code.

variables
  -files: files to watch
  -baseDir: where to find them?
---------------------------------------------------------------------- */

gulp.task('browser-sync', function () {
   var files = [
      'app/**/*.html',
      'app/**/*.nunjucks',
      'app/*.html',
      'app/css/*.css',
      //'app/assets/js/**/*.js'
   ];

   browserSync.init(files, {
      server: {
         baseDir: '.'
      }
   });
});


/*--------------------------- WATCHER ----------------------------
Watch files for changes and re-render pages whenever I change style
or HTML.

variables
  -
---------------------------------------------------------------------- */
function watcher(cb) {
    //gulp.watch('app/scss/**/*.scss', sassTask);
    gulp.watch('app/**/*.html', nunjucksRender);
    gulp.watch('app/js/**/*.+(js|html)', browserifyTask);
    gulp.watch('app/css/*.css', browserSync.reload);
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/js/**/*.js', browserSync.reload);
    cb();
};
gulp.task(watcher);

gulp.task('hi', function(done){
      console.log('hi!');
      done();
    });

/*--------------------------- DEFAULT ----------------------------
spin up a server & watch changes; default task for when i am
developing
---------------------------------------------------------------------- */
// gulp.task('default', function(cb){
//   gulp.series('nunjucks', 'browser-sync', 'watcher');
//   cb();
// });
exports.default = gulp.series('nunjucks', 'browser-sync', 'hi', 'watcher', 'hi');

/*--------------------------- BROWSERIFY----------------------------
capabilities:
-bundling multiple entry points into multiple destinations
variables
  -
---------------------------------------------------------------------- */
var autoprefixer = require('gulp-autoprefixer');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const stringify = require('stringify');
const buffer = require('vinyl-buffer');
const babelify = require("babelify");

function browserifyTask(cb) {
        browserify({
                'entries': ['app/js/main.js']
            })
            .transform(stringify, {
                appliesTo: {
                    includeExtensions: ['.html']
                }
            })
            .transform(babelify, {
                presets: ["env"]
            })
            .bundle()
            .pipe(source('main.js'))
            .pipe(buffer())
            .pipe(gulp.dest('.tmp/js'))
            .pipe(browserSync.reload({
                stream: true
            }))
            cb();
};
gulp.task(browserifyTask);

// function(gulp, browserSync) {
//   return function nunjucksRenderTask(cb) {
//     gulp
//       .src("app/**/*.html")
//       .pipe(
//         data(function() {
//           // var rdata = require('../archie.json');
//
//           return {
//             // data:rdata,
//             intro: require("../app/data/story.json"),
//             all_data: allrestaurantdata,
//             neighborlist: neighborlist
//           };
//         })
//       )
//       .on("error", function(err) {
//         console.log(err);
//       })
//       .pipe(
//         nunjucksRender({
//           searchPaths: ["app/templates"],
//           setUp(env) {
//             env.addFilter("md", text => marked(text));
//             return env;
//           }
//         })
//       )
//       .on("error", function(err) {
//         console.log(err);
//       })
//       .pipe(gulp.dest(".tmp"))
//       .pipe(
//         browserSync.reload({
//           stream: true
//         })
//       );
//     cb();
//   };
// };

// function sassTask(cb){
//             gulp.src(['app/scss/styles.scss']) // Gets all files ending with .scss in app/scss
//             .pipe(sass().on('error', sass.logError))
//             .pipe(autoprefixer())
//             .pipe(gulp.dest('.tmp/css'))
//             .pipe(browserSync.reload({
//                 stream: true
//             }))
//             cb();


/* GULP LOAD PLUGINS -----
all necessary plugins from packagelock.json
will be able to be referenced as plugin.nunjucks, plugin.sass, etc.
so i don't have to put in all the 'require' lines.
*/
var gulpLoadPlugins = require('gulp-load-plugins'),
    plugins = gulpLoadPlugins();
