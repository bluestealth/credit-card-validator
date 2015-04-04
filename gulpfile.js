'use strict';

var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var rename = require('gulp-rename');
var rm = require('gulp-rm');

gulp.task('default', ['clean','browserify','uglify']);

gulp.task('clean', function() {
	gulp.src('dist/*').pipe(rm());
});

gulp.task('browserify',['clean'], function () {
	var browserifyOptions = {
    entries: './credit-card-validator.js',
    debug: true,
		outfile: 'credit-card-validator-web.js', 
		standalone: 'credit-card-validator'
  };

  return browserify(browserifyOptions).bundle()
    .pipe(source('credit-card-validator-web.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
     .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('uglify', ['browserify'], function () {
	var uglifyOptions = {
		mangle: false,
		output: {
			screw_ie8: true,
			comments: true
		}
	};

	return gulp.src('./dist/credit-card-validator-web.js')
		.pipe(uglify(uglifyOptions))
		.pipe(rename({
			extname: '.min.js'
		}))
		.on('error', gutil.log)
		.pipe(gulp.dest('./dist'));
});

