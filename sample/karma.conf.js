module.exports = function(config) {
	config.set({
		// reporters: ['progress'],
		reporters: ['mocha'],

		autoWatch: true,

		files: [
			'test/lib/angular.js',
			'test/lib/angular-mocks.js',
			'test/lib/mocked-modules.js',
			'test/lib/expect.js',

			'src/**/*.module.js',
			'src/**/*.js',
			'src/**/*.spec.js'
		],

		exclude: [
			'src/**/*.routes.js'
		],

		// urlRoot: '/__karma__/',
		browsers: ['PhantomJS'],

		// frameworks: ['jasmine']
		frameworks: ['mocha'],

		// only show the changed specs
		mochaReporter: {
			output: 'autowatch'
		}
	});
};
