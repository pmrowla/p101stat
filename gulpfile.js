'use strict';

var gulp = require('gulp'),
    browserify = require('gulp-browserify'),
    size = require('gulp-size'),
    clean = require('gulp-clean');

gulp.task('transform', function () {
  return gulp.src('./p101stat/static/jsx/script.js')
    .pipe(browserify({transform: ['reactify']}))
    .pipe(gulp.dest('./p101stat/static/js'))
    .pipe(size());
});

gulp.task('clean', function () {
  return gulp.src(['./p101stat/static/scripts/js'], {read: false})
    .pipe(clean());
});

gulp.task('default', ['clean'], function () {
  gulp.start('transform');
  gulp.watch('./p101stat/static/jsx/script.js', ['transform']);
});
