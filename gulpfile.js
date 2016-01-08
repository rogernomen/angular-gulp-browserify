// gulp
var gulp = require('gulp');

// plugins
var connect = require('gulp-connect');
var livereload = require('gulp-livereload')
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var clean = require('gulp-clean');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var runSequence = require('run-sequence');
var less = require('gulp-less');

// tasks
gulp.task('lint', function() {
  gulp.src(['./app/**/*.js', '!./app/bower_components/**'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});
gulp.task('clean', function() {
    gulp.src('dist/*')
      .pipe(clean({force: true}));
    gulp.src('./app/js/bundled.js')
      .pipe(clean({force: true}));
});
gulp.task('minify-css', function() {
  var opts = {comments:true,spare:true};
  gulp.src(['./app/**/*.css', '!./app/bower_components/**'])
      .pipe(livereload())
    .pipe(minifyCSS(opts))
    .pipe(gulp.dest('./dist/'));
});
gulp.task('copy-css', function () {
  gulp.src('./app/css/*.css')
      .pipe(gulp.dest('dist/'));
})

// porque no minifica el bundle.js???
gulp.task('minify-js', function() {
  gulp.src('./dist/**/*.js')
    .pipe(uglify({
      // inSourceMap:
      // outSourceMap: "app.js.map"
    }))
    .pipe(gulp.dest('./dist/js/'));
});


gulp.task('copy-bower-components', function () {
  gulp.src('./app/bower_components/**')
    .pipe(gulp.dest('dist/bower_components'));
});
gulp.task('copy-html-files', function () {
  gulp.src('./app/**/*.html')
    .pipe(gulp.dest('dist/'));
});
gulp.task('connect', function () {
  connect.server({
    root: 'app/',
    port: 8888
  });
});
gulp.task('connectDist', function () {
  connect.server({
    root: 'dist/',
    port: 9999
  });
});

// BROWSERIFY
gulp.task('browserify', function() {
  gulp.src(['app/js/main.js'])
  .pipe(browserify({
    insertGlobals: true,
    debug: true
  }))
  .pipe(concat('bundled.js'))
  .pipe(gulp.dest('dist/js/'))
});
gulp.task('browserifyDist', function() {
  gulp.src(['app/js/*.js'])
  .pipe(browserify({
    insertGlobals: true,
    debug: true
  }))
  .pipe(concat('bundled.js'))
  .pipe(gulp.dest('./dist/js'));
});



// LESS TO CSS
gulp.task('less', function () {
  gulp.src('app/css/main.less') //path to your main less file
      .pipe(less())
      .pipe(gulp.dest('./app/css')) // your output folder

});
gulp.task('lessdev', function () {
  gulp.src('app/css/main.less') //path to your main less file
      .pipe(less())
      .pipe(gulp.dest('./dist/css')) // your output folder
      .pipe(livereload());
});



gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('app/css/*.less', ['lessdev']);
  gulp.watch('app/js/*.js', ['browserify']);
})


// // *** default task *** //
// gulp.task('default',
//   ['lint', 'browserify', 'connect']
// );
// // *** build task *** //
// gulp.task('build',
//   ['lint', 'minify-css', 'browserifyDist', 'copy-html-files', 'copy-bower-components', 'connectDist']
// );

// *** default task *** //
gulp.task('default', function() {
  runSequence(
    ['clean'],
    ['lint', 'browserify', 'connect']
  );
});
// *** build task *** //
gulp.task('build', function() {
  runSequence(
    ['clean'],
    ['lint', 'less', 'minify-css', 'browserifyDist', 'minify-js', 'copy-html-files', 'copy-bower-components', 'connectDist']
  );
});

gulp.task('dev', function () {
  runSequence(
      ['clean'],
      ['lint', 'watch', 'less', 'minify-css', 'browserify', 'copy-html-files', 'copy-bower-components', 'connectDist']
  );
})