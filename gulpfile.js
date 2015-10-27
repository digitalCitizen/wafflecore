// Include gulp
var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    sass = require('gulp-sass'),
    cache = require('gulp-cache'),
    browserSync = require('browser-sync'),
    imagemin = require('gulp-imagemin'),
    del = require('del'),
    runSequence = require('run-sequence'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    uncss = require('gulp-uncss');

// Static server
gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: 'app'
    },
  })
});

gulp.task('lint', function() {
    return gulp.src('js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('styles', function() {
  return gulp.src('app/scss/**/*.scss') // Gets all files ending with .scss in app/scss
    .pipe(sass())
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('procecss', function () {
  return gulp.src('app/**/*.css')
    .pipe(sourcemaps.init())
    .pipe(autoprefixer())
    .pipe(concat('all.css'))
    .pipe(uncss({
      html: ['app/**.html']
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'));
});

gulp.task('images', function(){
  return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
  // Caching images that ran through imagemin
  .pipe(cache(imagemin()))
  .pipe(gulp.dest('dist/images'))
});

gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
});

// Watch Files For Changes
gulp.task('watch', ['browserSync', 'styles'], function (){
  gulp.watch('app/scss/**/*.scss', ['styles']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
});

gulp.task('clean:dist', function(callback){
  del(['dist/**/*', '!dist/images', '!dist/images/**/*'], callback)
});

gulp.task('clean', function(callback) {
  del('dist');
  return cache.clearAll(callback);
});

// Default Tasks
gulp.task('build', function (callback) {
  runSequence('clean:dist',
    ['styles', 'lint', 'images', 'fonts'],
    callback
  )
});

gulp.task('default', function (callback) {
  runSequence(['styles', 'procecss', 'browserSync', 'watch'],
    callback
  )
});
