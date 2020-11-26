'use strict';

var gulp = require('gulp');
var nunjucksRender = require('gulp-nunjucks-render');
var nunjucks = require('gulp-nunjucks');
var browserSync = require('browser-sync').create();
var runSequence = require('run-sequence');

gulp.task('hi', function(done){
  console.log('hi!');
  done();
});

gulp.task('nunjucks', function() {
  // Gets .html and .nunjucks files in pages
  return gulp.src('app/pages/**/*.+(html|nunjucks)')
  // Renders template with nunjucks
  .pipe(nunjucksRender({
      path: ['app/templates']
    }))
  // output files in app folder
  .pipe(gulp.dest('app'))
});


//browser-sync is task name
//  gulp.task('browserSync', function() {
//    browserSync.init({
//      server: {
//        baseDir: 'app'
//      },
//    })
//  });
//
//
// gulp.task('watch', function(){
//   //gulp.watch('app/scss/**/*.scss', ['sass']);
//   //Reloads the browser whenever HTML or JS files change
//   gulp.watch('app/**/*.html', nunjucks);
//   gulp.watch('app/css/*.css', browserSync.reload);
//   gulp.watch('app/*.html', browserSync.reload);
//   gulp.watch('app/js/**/*.js', browserSync.reload);
// });
//
// gulp.task('default', function (callback) {
//   runSequence(['browserSync', 'watch'], hi, callback)//brackets means they run in parallel
//   //otherwise they run as runsFirst,runSecond, runThird
//
// });


exports.default = gulp.series(nunjucks, hi);
//exports.default = hi
