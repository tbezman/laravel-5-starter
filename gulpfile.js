var useref = require('gulp-useref');
var gulp = require('gulp');
var browserSync = require('browser-sync');
var connect = require('gulp-connect-php');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var minifyCss = require('gulp-minify-css');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var pipe = require('multiple');
var config = require('./config')

gulp.task('styles', function () {
    return gulp.src(config.styles.input)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.styles.output));
});

gulp.task('serve', ['watch'], function () {
    connect.server({
        base: './public'
    }, function () {
        browserSync({
            notify: false,
            open: false,
            proxy: 'localhost:8000'
        })
    });
});

gulp.task('watch', ['styles'], function () {
    var sassWatchers = [
        config.styles.input,
        './public/styles/**/*.scss'
    ];

    var jsWatchers = [
        './public/scripts/*.js',
        './public/scripts/**/*.js',
    ];

    sassWatchers.forEach(function (watcher) {
        gulp.watch(watcher, ['styles', browserSync.reload]);
    });

    jsWatchers.forEach(function (watcher) {
        gulp.watch(watcher, [browserSync.reload])
    })
});

gulp.task('dist', function () {
    gulp.src(config.styles.input)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(minifyCss())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.build.output));

    gulp.src('public/index.html')
        .pipe(useref())
        .pipe(gulpif('*.js', ngAnnotate()))
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('.css', minifyCss()))
        .pipe(gulp.dest(config.build.output));
});

