// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var sassGlob = require('gulp-sass-glob');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var postcss = require('gulp-postcss');
var cssmin = require('gulp-cssmin');
var plumber = require('gulp-plumber');
var autoprefixer = require('autoprefixer');
var notify = require('gulp-notify');
var scsslint = require('gulp-scss-lint');
var scssLintStylish = require('gulp-scss-lint-stylish');
var imagemin = require('gulp-imagemin');
var insert = require('gulp-insert');


// Compile Our Sass
gulp.task('sass', function() {
  return gulp.src('scss/yourfilename.scss')
    // Globbing all imported files with the path /**/*.scss stark.scss
    .pipe(sassGlob())
    // Plumber allows us to bypass errors and pipe them to the Mac notification center, if possible
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    // Running SASS to compile to CSS
    .pipe(sass())
    // Prefixing ONLY our CSS file with vendor prefixes so that we don't need them in our SCSS files
    .pipe(postcss([autoprefixer({
      browsers: ['last 2 versions']
    })]))
    .pipe(gulp.dest('css'))
    // Minifying CSS
    .pipe(cssmin())
    // Renaming this minified file
    .pipe(rename('yourfilename.min.css'))
    // Piping this minfied CSS file to the CSS folder
    .pipe(gulp.dest('css'));
});

//Concatenate & Minify JS
gulp.task('scripts', function() {
  return gulp.src('js/*.js')
    // Plumber allows us to bypass errors and pipe them to the Mac notification center, if possible
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    // Hinting and linting our JS files
    .pipe(jshint())
    // Using JSHint Stylish to display linting messages for an easier read in terminal
    .pipe(jshint.reporter('jshint-stylish'))
    // Concatenates all /scripts/*.js files into one JS file
    .pipe(concat('stark.js'))
    // Wraps this main.js file with jQuery closure (and/or any other wrappers we need)
    .pipe(insert.wrap('(function ($) {', '}(jQuery));')) // prepends 'string1' and appends 'string2' to the contents
    .pipe(gulp.dest('js'))
    // start uglify
    .pipe(uglify())
    // Renames this uglified, concatenated file to a min version.
    .pipe(rename('yourfilename.min.js'))
    // Pipes this minified js file to the JS folder
    .pipe(gulp.dest('js'));
});

//SCSS Linting
gulp.task('scsslint', function() {
  // Lints all scss/**/*.scss files, but excludes all utility SCSS files, as these often are from external libraries or legacy content, and here there be dragons
  return gulp.src(['scss/*/*.scss', '!scss/utilities/*.scss'])
    .pipe(scsslint({
      'config': 'scss_linters.yml',
      // Using SCSS Lint Stylish to display linting messages for an easier read in terminal
      customReport: scssLintStylish
    }))
});

//Image minification
gulp.task('imagemin', function() {
    return gulp.src('images/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('images/'))
});

// Watch files for changes on JS or SCSS change.
gulp.task('watch', function() {
  gulp.watch('js/scripts/*.js', ['scripts']);
  gulp.watch('scss/*/*.scss', ['sass']);
  gulp.watch('images/**/*', ['imagemin']);
});

// Default Task
gulp.task('default', ['sass', 'scripts', 'watch', 'imagemin']);
