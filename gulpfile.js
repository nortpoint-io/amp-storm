var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var del = require('del');
var sequence = require('run-sequence');
var imagemin = require('gulp-imagemin');

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
    gulp.watch(SRC_DIR + '/images/*', ['imagemin']);

    gulp.watch(BUILD_DIR + '/*.html')
        .on('change', browserSync.reload);
    gulp.watch(BUILD_DIR + '/images/*')
        .on('change', browserSync.reload);
});

gulp.task('imagemin', function() {
    return gulp.src(SRC_DIR + '/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest(BUILD_DIR + '/images'))
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
        ['copy', 'sass', 'imagemin'],
        callback
    );
});
gulp.task('default', ['serve']);
