'use strict';
 
var gulp = require('gulp');
var maps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var jade = require('gulp-jade');
var del = require('del');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var browserSync = require('browser-sync').create();
var pages = require('gulp-gh-pages');

var options = {
  remoteUrl: '???',
  branch: 'master'
};


// JADE
// ---------
gulp.task('compileJade', function() {
  return gulp.src('./src/[^_]*.jade')
  .pipe(jade())
  .pipe(gulp.dest('./dist/'))
});


// JS
//----------
gulp.task("concatJS", function() {
  return gulp.src('src/js/**/*.js')
    .pipe(maps.init())
    .pipe(concat('app.js'))
    .pipe(maps.write('./'))
    .pipe(gulp.dest('dist/js'));
});

gulp.task("minifyJS", ["concatJS"], function() {
  return gulp.src("dist/js/*.js")
    .pipe(uglify())
    .pipe(rename('app.min.js'))
    .pipe(gulp.dest('dist/js'));
});


// SASS
//----------
gulp.task('compileSass', function() {
  return gulp.src("./src/scss/main.scss")
    .pipe(maps.init())
    .pipe(sass())
    .pipe(maps.write('./'))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('minifySass', function () {
  gulp.src('src/scss/**/*.scss')
  .pipe(sass.sync().on('error', sass.logError))
  .pipe(sass({outputStyle: 'compressed'}))
  .pipe(gulp.dest('dist/css'));
});
 

// UTIL
//---------
gulp.task('clean', function () {
  del(['dist/**/*',]);
});

gulp.task('copyFiles', function() {
  gulp.src(['./src/**/*.{jpg,png,js}', './src/CNAME'])
  .pipe(gulp.dest('./dist'));
});

gulp.task("build", ["clean", "compileJade", "copyFiles", "minifySass"]);


gulp.task('deploy', function() {
  return gulp.src('dist/**/*')
  .pipe(pages(options));
});


gulp.task('browser', function() {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });
});
