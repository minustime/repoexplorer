var gulp = require('gulp');
var concat = require('gulp-concat');
var jade = require('gulp-jade');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
var sass = require('gulp-sass');
var ngAnnotate = require('gulp-ng-annotate');

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

//-------------
// Build tasks
//-------------

gulp.task('build', ['process-js', 'process-jade', 'process-sass']);

gulp.task('watch', function() {
	gulp.watch('src/**', ['build']);
});