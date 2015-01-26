describe('ProfileViewController', function() {
	var controllerAlias = 'viewer',
		controllerName = 'ProfileViewController as ' + controllerAlias;

	beforeEach(module('app'));

	describe('@profile', function() {
		it('should set a `profile` on scope using the provided profile', inject(function($controller, $rootScope) {
			var $scope = $rootScope.$new();

			var profile = {
				id: 123
			};

			$controller(controllerName, {
				$scope: $scope,
				profile: profile
			});

			var vm = $scope[controllerAlias];

			expect(vm.profile).to.be(profile);
		}));
	});
});
