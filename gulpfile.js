// Include gulp
var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    sass = require('gulp-sass'),
    cache = require('gulp-cache'),
    browserSync = require('browser-sync'),
    imagemin = require('gulp-imagemin'),
    del = require('del'),
    runSequence = require('run-sequence'),
    autoprefixer = require('gulp-autoprefixer'),
    nunjucks = require('gulp-nunjucks-render');

// Static server
gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: 'build'
    }
  })
});

gulp.task('lint', function() {
    return gulp.src('js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('styles', function() {
    return gulp.src('app/scss/*.scss') // Gets all files ending with .scss in app/scss
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('build/css'))
});

gulp.task('external_styles', function () {
    return gulp.src('app/**/*.css')
        /*.pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))*/
        .pipe(gulp.dest('build'));
});

gulp.task('images', function(){
    return gulp.src('app/img/**/*.+(png|jpg|jpeg|gif|svg)')
        // Caching images that ran through imagemin
        .pipe(cache(imagemin()))
        .pipe(gulp.dest('build/img'))
});

gulp.task('fonts', function() {
    return gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('build/fonts'))
});

gulp.task('js', function() {
    return gulp.src('app/js/**/*')
        .pipe(gulp.dest('build/js'))
});

gulp.task('html', function() {
    // Gets .html and .nunjucks files in pages
    return gulp.src('app/pages/**/*.+(html|nunjucks)')
    // Renders template with nunjucks
        .pipe(nunjucks({
            path: ['app/templates']
        }))
        // output files in app folder
        .pipe(gulp.dest('build'))
});

gulp.task('favicon', function() { 
    return gulp.src('app/**/*.ico')
        .pipe(gulp.dest('build'))
});

// Watch Files For Changes
gulp.task('watch', ['browserSync', 'html', 'styles'], function (){
    gulp.watch('app/scss/**/*.scss', ['styles', browserSync.reload]);
    gulp.watch('app/**/*.+(html|nunjucks)',['html', browserSync.reload]);
    gulp.watch('app/js/**/*.js', browserSync.reload);
});

gulp.task('clean', function(callback) {
    del('dist');
    return cache.clearAll(callback);
});

// Default Tasks

gulp.task('default', function (callback) {
    runSequence(['html', 'external_styles', 'styles', 'js', 'images', 'browserSync', 'watch'],
    callback
    )
});

gulp.task('publish', function (){
    runSequence('clean', ['procecss', 'js', 'images', 'favicon'])
});