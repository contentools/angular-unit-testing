beforeEach(function() {
	/**
	 * Array of vendor modules that won't be loaded on unit tests
	 */
	var mockedModules = ['ui.router'];

	mockedModules.forEach(function(module) {
		angular.module(module, []);
	});
});
