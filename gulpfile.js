/* jshint strict: false, node: true */
var gulp = require('gulp'),
	karma = require('karma').server;

// @see https://github.com/karma-runner/gulp-karma#do-we-need-a-plugin
gulp.task('test', function(done) {
	karma.start({
		configFile: __dirname + '/karma.conf.js',
		singleRun: true
	}, done);
});

gulp.task('tdd', function(done) {
	karma.start({
		configFile: __dirname + '/karma.conf.js',
		singleRun: false
	}, done);
});
