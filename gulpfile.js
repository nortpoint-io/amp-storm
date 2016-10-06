var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var del = require('del');
var sequence = require('run-sequence');
var imagemin = require('gulp-imagemin');
var csso = require('gulp-csso');
var htmlmin = require('gulp-htmlmin');
var htmlreplace = require('gulp-html-replace');

var SRC_DIR = 'src';
var BUILD_DIR = 'build';
var DIST_DIR = 'dist';

gulp.task('clean-dist', function() {
    return del(DIST_DIR);
});

gulp.task('clean-build', function() {
    return del(BUILD_DIR);
});

gulp.task('clean', [
    'clean-dist',
    'clean-build'
]);

gulp.task('styles', function() {
    return gulp.src(SRC_DIR + '/scss/*.scss')
        .pipe(sass())
        .pipe(csso())
        .pipe(gulp.dest(BUILD_DIR + '/css'));
});

gulp.task('copy-styles', function() {
    return gulp.src(BUILD_DIR + '/css/page.css')
                .pipe(gulp.dest(DIST_DIR + '/css'))
                .pipe(browserSync.stream());
});

gulp.task('copy-html', function() {
    return gulp.src([SRC_DIR + '/page.html', SRC_DIR + '/index.html'])
                .pipe(gulp.dest(BUILD_DIR));
});

gulp.task('copy-favicons', function() {
    return gulp.src(SRC_DIR + '/favicons/**/*')
                .pipe(gulp.dest(DIST_DIR));
});

gulp.task('copy', [
    'copy-favicons'
]);

gulp.task('serve', ['build'], function() {
    browserSync.init({ server: './' + DIST_DIR });

    gulp.watch(SRC_DIR + '/*.html', ['copy-html']);
    gulp.watch(BUILD_DIR + '/*.html', ['minify-html']);
    gulp.watch(SRC_DIR + '/scss/*.scss', ['styles']);
    gulp.watch(SRC_DIR + '/images/*', ['imagemin']);
    gulp.watch(BUILD_DIR + '/css/page.css', ['copy-styles']);

    gulp.watch(DIST_DIR + '/*.html')
        .on('change', browserSync.reload);
    gulp.watch(DIST_DIR + '/images/*')
        .on('change', browserSync.reload);
});

gulp.task('imagemin', function() {
    return gulp.src(SRC_DIR + '/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest(DIST_DIR + '/images'))
});

gulp.task('minify-html', function() {
  return gulp.src(BUILD_DIR + '/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(DIST_DIR));
});

gulp.task('inline-css', function() {
  return gulp.src(SOURCE.AMPHTML)
    .pipe(htmlreplace({
      'cssInline': {
        'src': gulp.src(SOURCE.CLEANED_CSS).pipe(cleanCSS()),
        'tpl': '<style amp-custom>%s</style>'
      }
    }))
    .pipe(gulp.dest(BUILD_PATH));
});

gulp.task('build', function(callback) {
    sequence(
        'clean',
        ['styles', 'copy-html'],
        ['copy-favicons', 'copy-styles', 'minify-html', 'imagemin'],
        callback
    );
});
gulp.task('default', ['serve']);
