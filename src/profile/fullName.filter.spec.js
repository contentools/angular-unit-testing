describe('fullNameFilter', function() {
	beforeEach(module('profile'));

	it('should return the full name of a given profile', inject(function($filter) {
		var profile = {
			firstName: 'John',
			lastName: 'Doe'
		};

		expect($filter('fullName')(profile)).to.be('John Doe');

		profile.lastName = null;

		expect($filter('fullName')(profile)).to.be('John');
	}));
});
