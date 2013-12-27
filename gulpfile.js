var gulp = require('gulp'),
    concat = require('gulp-concat'),
    jshint = require('gulp-jshint'),
    myth = require('gulp-myth'),
    svgmin = require('gulp-svgmin'),
    uglify = require('gulp-uglify');

gulp.task('test', function () {
  gulp.src('./src/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('js', function () {
  gulp.src('./src/js/*.js')
    .pipe(concat('sigma.io.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./public/js'));
});

gulp.task('css', function () {
  gulp.src('./src/css/*.css')
    .pipe(myth())
    .pipe(gulp.dest('./public/css'));
});

gulp.task('svg', function() {
  gulp.src('./src/svg/*.svg')
    .pipe(svgmin())
    .pipe(gulp.dest('./public/img'));
});

gulp.task('default', function () {
  gulp.run('test', 'js', 'css', 'svg');
  gulp.watch(['./src/js/*.js', './src/css/*.css', './src/svg/*.svg'], function () {
    gulp.run('test', 'js', 'css', 'svg');
  });
});