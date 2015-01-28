/* jshint strict: false, node: true */
var gulp = require('gulp'),
	karma = require('karma').server,
	nodePath = require('path'),
	concat = require('gulp-concat'),
	wrap = require('gulp-wrap'),
	livereload = require('gulp-livereload'),
	EventEmitter = require('events').EventEmitter,
	gulpthrough = require('gulp-through'),

	SOURCE_PATH = 'src',
	BUILD_PATH = '.build/tmp',
	PUBLIC_PATH = 'public',

	join = nodePath.join.bind(nodePath),
	wrapper = '(function(undefined){\n\n<%= contents %>\n}());',

	modules = ['profile'],
	apps = ['app'];

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

var unitTestingBaseFiles = [
	'test/lib/angular.js',
	'test/lib/angular-mocks.js',
	'test/lib/mocked-modules.js',
	'test/lib/expect.js'
];

function makeModuleTmpFileName(moduleName) {
	return join(BUILD_PATH, moduleName + '.module.js');
}

var domainModuleFiles = modules.map(makeModuleTmpFileName);

function getFileListsOfAModule(isApp, moduleName) {
	var srcPath = join(SOURCE_PATH, moduleName);

	var files = [
		join(srcPath, '*.module.js')
	];

	var testFiles, buildFiles;

	if (isApp) {
		testFiles = unitTestingBaseFiles.concat(domainModuleFiles);
		buildFiles = domainModuleFiles.concat(files);
	} else {
		testFiles = unitTestingBaseFiles.slice();
		buildFiles = files.slice();
	}

	testFiles = testFiles.concat(files)
		.concat([
			join(srcPath, '**/*.js'),
			join(srcPath, '**/*.spec.js')
		]);

	buildFiles = buildFiles.concat([
		join(srcPath, '**/*.js'),
		'!' + join(srcPath, '**/*.spec.js')
	]);

	return {
		test: testFiles,
		build: buildFiles
	};
}

function getFileListsOfDomain(moduleName) {
	return getFileListsOfAModule(false, moduleName);
}

function getFileListsOfApp(moduleName) {
	return getFileListsOfAModule(true, moduleName);
}

function runKarmaOnFiles(files, done) {
	karma.start({
		configFile: __dirname + '/karma.conf.js',
		files: files,
		singleRun: true
	}, done);
}

function buildModuleFromFileList(moduleName, files, done) {
	var build = gulp.src(files)
		.pipe(concat(moduleName + '.module.js'))
		.pipe(wrap(wrapper))
		.pipe(gulp.dest('.build/tmp'));

	build.on('end', done);
}

function buildDomainModule(moduleName, done) {
	console.log('Building module: ', moduleName);
	var files = getFileListsOfDomain(moduleName);

	runKarmaOnFiles(files.test, function(exitCode) {
		if (exitCode) {
			console.log('@@@ Tests failed & build stopped!');
			return;
		}

		buildModuleFromFileList(moduleName, files.build, done);
	});
}

function buildAppModule(moduleName, done) {
	console.log('Building app: ', moduleName);
	var files = getFileListsOfApp(moduleName);

	runKarmaOnFiles(files.test, function(exitCode) {
		if (exitCode) {
			console.log('@@@ Tests failed & build stopped!');
			return;
		}

		var appFiles = domainModuleFiles.concat(files.build);

		buildModuleFromFileList(moduleName, appFiles, done);
	});
}

function makeTemplate(html, options) {
	var result = '';

	var scripts = (options.scripts || []).map(function(item) {
		return '<script src="' + item + '"></script>';
	});

	var stylesheets = (options.stylesheets || []).map(function(item) {
		return '<link rel="stylesheet" href="' + item + '" />';
	});

	result = html
		.replace('<!-- scripts -->', scripts.join('\n'))
		.replace('<!-- stylesheets -->', stylesheets.join('\n'));

	return result;
}

gulp.task('watch', function() {
	livereload.listen();

	var globalEmitter = new EventEmitter();

	modules.forEach(function(moduleName) {
		var watcher = gulp.watch(join(SOURCE_PATH, moduleName, '**'));

		watcher.on('change', moduleWasChanged);

		function moduleWasChanged() {
			buildDomainModule(moduleName, afterBuildModule);
		}

		function afterBuildModule() {
			console.log('>>> Module', moduleName, 'changed');
			globalEmitter.emit('domain.changed', moduleName);
		}
	});

	apps.forEach(function(appName) {
		var watcher = gulp.watch(join(SOURCE_PATH, appName, '**/*.js'));

		watcher.on('change', appWasChanged);
		globalEmitter.on('domain.changed', appWasChanged);

		function appWasChanged() {
			buildAppModule(appName, afterBuildApp);
		}

		function afterBuildApp() {
			console.log('>>> APP', appName, 'changed');
			globalEmitter.emit('app.changed', appName);
		}
	});

	globalEmitter.on('app.changed', livereload.changed);
});

gulp.task('app-template', function() {
	var srcFile = join(SOURCE_PATH, 'index.html');

	gulp.src(srcFile)
		.pipe(insertTemplates({
			scripts: ['app.js'],
			stylesheets: ['app.css']
		}))
		.pipe(gulp.dest(join(PUBLIC_PATH)));
});

var insertTemplates = gulpthrough('insert-templates', function(file, options) {
	if (nodePath.extname(file.path) !== '.html') return;

	var result = makeTemplate(String(file.contents), options);

	file.contents = new Buffer(result);
});
