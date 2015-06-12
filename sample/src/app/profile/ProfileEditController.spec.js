describe('ProfileEditController', function() {
	var controllerAlias = 'editor',
		controllerName = 'ProfileEditController as ' + controllerAlias;

	beforeEach(module('app'));

	beforeEach(module(function($provide) {
		$provide.service('ProfileService', function($q) {
			var ProfileServiceMock = {
				saved: false,
				shouldSave: true,
				shouldLoad: true,
				update: function() {
					this.saved = true;
					return this.shouldSave ? $q.when(true) : $q.reject();
				}
			};

			return ProfileServiceMock;
		});
	}));

	describe('@profile', function() {
		it('should write the `profile` property on scope with the loaded profile', inject(function($controller, $rootScope) {
			var $scope = $rootScope.$new(),
				profile = {
					id: 123
				};

			$controller(controllerName, {
				$scope: $scope,
				profile: profile
			});

			var vm = $scope[controllerAlias];

			expect(typeof vm.profile).to.be('object');
			expect(vm.profile.id).to.be(profile.id);
		}));
	});

	describe('#save', function() {
		it('should have a method to save the profile changes', inject(function($controller, $rootScope, ProfileService) {
			var $scope = $rootScope.$new(),
				profile = {
					id: 123
				};

			ProfileService.shouldSave = true;

			$controller(controllerName, {
				$scope: $scope,
				profile: profile
			});

			var vm = $scope[controllerAlias];

			expect(typeof vm.update).to.be('function');

			vm.update();

			expect(ProfileService.saved).to.be(true);
		}));
	});
});
