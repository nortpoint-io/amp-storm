var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var del = require('del');
var sequence = require('run-sequence');

var SRC_DIR = 'src';
var BUILD_DIR = 'build';

gulp.task('clean', function() {
    return del(BUILD_DIR);
});

gulp.task('copy-html', function() {
    return gulp.src(SRC_DIR + '/*.html')
                .pipe(gulp.dest(BUILD_DIR));
});

gulp.task('copy-favicons', function() {
    return gulp.src(SRC_DIR + '/favicons/**/*')
                .pipe(gulp.dest(BUILD_DIR));
});

gulp.task('copy', [
    'copy-html',
    'copy-favicons'
]);

gulp.task('serve', ['build'], function() {
    browserSync.init({ server: './' + BUILD_DIR });

    gulp.watch(SRC_DIR + '/*.html', ['copy-html']);
    gulp.watch(SRC_DIR + '/scss/*.scss', ['sass']);
});

gulp.task('sass', function() {
    return gulp.src(SRC_DIR + '/scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest(BUILD_DIR + '/css'))
        .pipe(browserSync.stream());
});

gulp.task('build', function(callback) {
    sequence(
        'clean',
        ['copy', 'sass'],
        callback
    );
});
gulp.task('default', ['serve']);