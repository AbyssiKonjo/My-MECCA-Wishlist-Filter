const gulp = require('gulp');

// SASS
const sass = require('gulp-sass')(require('sass'));
const minifyCss = require('gulp-minify-css');
// Rename files:
const rename = require('gulp-rename');
// Live Reload
const livereload = require('gulp-livereload');
const connect = require('gulp-connect');
// Check JS for errors
const jshint = require('gulp-jshint');
// Minification of our JS
const uglify = require('gulp-uglify')

// Server Task - Live server:
function serve(done) {
    connect.server({
        root: '',
        port: 1988,
        livereload: true
    });
    done();
}

// Styles Task - Sass:
function styles(done) {
    gulp.src('css/style.scss') // source file for sass
        .pipe(sass({ outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename({suffix: '.min'})) // minify css file made be sass
        .pipe(minifyCss({ processImport: false}))
        .pipe(gulp.dest('css/')) // destination folder for the css file
        .pipe(connect.reload());
    done();
}

// HTML
function html(done) {
    gulp.src('./*.html')
        .pipe(connect.reload());
    done();
}

// JS Lint Task
function lint(done) {
    gulp.src(['js/script.js', '!js/*.min.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(connect.reload());
    done();
}

// JS Minification
function minifyJs(done) {
    gulp.src(['js/script.js', '!js/*.min.js'])
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('js/'))
        .pipe(connect.reload());
    done();
}

// Watch task to watch for file changes
function watch(done) {
    gulp.watch('css/*.scss', gulp.series(styles));
    gulp.watch('./*.html', gulp.series(html));
    gulp.watch(['js/script.js', '!js/*.min.js'], gulp.series(lint, minifyJs));
    done();
}

// Run the task:
gulp.task('default', gulp.series(serve, watch, lint, minifyJs, html, styles));