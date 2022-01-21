const { src, dest, series, parallel, watch } = require("gulp");

// Include gulp
const gulp = require('gulp'),
  eslint = require('eslint'),
  sass = require('gulp-sass')(require('sass'))
  concat = require('gulp-concat'),
  cache = require('gulp-cache'),
  browserSync = require('browser-sync').create(),
  del = require('del');

function createServer() {
	browserSync.init({
		server: {
			baseDir: 'build',
		},
	});
};


function lint(cb) {
  return gulp.src('js/*.js')
    .pipe(eslint())
    .pipe(eslint.reporter('default'));
  cb();
};

// const compiled = sass.compile({
//     file: 'app/scss/*.scss'
//   }, function(err, result) {
//     console.log(err, result);
//   }
// );
  // return gulp.src('app/scss/*.scss') // Gets all files ending with .scss in app/scss
  //   .pipe(sass.render)
  //   .pipe(gulp.dest('build/css'));
  // cb();

function styles(cb) {
  del('build/css/styles.css');
  return src("app/scss/*.scss")
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('styles.css'))
    .pipe(dest('build/css'))
    .pipe(browserSync.stream());
  cb();
};

function external_styles(cb) {
  return gulp.src('app/**/*.css')
    .pipe(gulp.dest('build'))
    .pipe(browserSync.stream());
  cb();
};

function fonts(cb) {
  return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('build/fonts'))
    .pipe(browserSync.stream());
  cb();
};

function javascript(cb) {
  return gulp.src('app/js/**/*')
    .pipe(gulp.dest('build/js'))
    .pipe(browserSync.stream());
  cb();
};

function html(cb) {
  return gulp.src('app/pages/**/*')
    .pipe(gulp.dest('build'))
    .pipe(browserSync.stream());
  cb();
};

function favicon(cb) {
  return gulp.src('app/**/*.ico')
    .pipe(gulp.dest('build'));
  cb();
};

function clean(cb) {
  del('build');
  return cache.clearAll(callback);
  cb();
};

// Watch Files For Changes
function watchFiles() {
  watch('app/scss/**/*.scss').on('change', series(styles, browserSync.reload));
  watch('app/**/*.html').on('change', series(html, browserSync.reload));
  watch('app/js/**/*.js').on('change', series(javascript, browserSync.reload));
};

// Default Tasks
exports.default = parallel(createServer, series(html, external_styles, styles, javascript, watchFiles));
exports.build = series(clean, html, external_styles, styles, javascript, favicon);
exports.clean = clean;
