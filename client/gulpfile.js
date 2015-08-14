var gulp = require('gulp');
var concat = require('gulp-concat');
var jade = require('gulp-jade');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
var sass = require('gulp-sass');
var jshint = require('gulp-jshint');
var ngAnnotate = require('gulp-ng-annotate');

// Lint JavaScript
gulp.task('lint-js', function() {
	gulp.src(['src/**/app.js', 'src/**/*.js'])
		.pipe(jshint('.jshintrc'))
		.pipe(jshint.reporter('jshint-stylish'));
});

// Process JavaScript files
gulp.task('process-js', function() {
	gulp.src(['src/**/app.js', 'src/**/*.js'])
		.pipe(concat('app.js'))
		.pipe(ngAnnotate())
		.pipe(uglify())
		.pipe(gulp.dest('dist'));
});

// Process Jade files
gulp.task('process-jade', function() {
	gulp.src(['src/**/*.jade'])
		.pipe(jade({
			pretty: true
		}))
		.pipe(gulp.dest('dist'));
});

// Process SASS files
gulp.task('process-sass', function() {
	gulp.src(['src/**/*.scss'])
		.pipe(sass({
			outputStyle: 'compressed'
		}))
		.pipe(gulp.dest('dist'));
});

// Watch for changes to the source files
gulp.task('watch-all', function() {
	gulp.watch('src/**', ['build']);
});

//-------------
// Build tasks
//-------------

gulp.task('default', ['build']);
gulp.task('build', ['lint-js', 'process-js', 'process-jade', 'process-sass']);
gulp.task('watch', ['build', 'watch-all']);