$module.config(['$stateProvider',
	function($stateProvider, $urlRouterProvider) {

		var resolveMyProfile = function(UserService) {
			return UserService.findMyProfile();
		};

		var states = {
			'index': {
				url: '',
				templateUrl: '/home.html'
			},

			'profile-view': {
				url: '/profile/:id',
				templateUrl: '/profile/view.html',
				controller: 'ProfileViewController',
				controllerAs: 'viewer',
				resolve: {
					profile: resolveMyProfile
				}
			},

			'profile-edit': {
				url: '/profile/:id/edit',
				templateUrl: '/profile/edit.html',
				controller: 'ProfileEditController',
				controllerAs: 'editor',
				resolve: {
					profile: resolveMyProfile
				}
			}
		};

		$urlRouterProvider.when('', '/user');

		angular.forEach(states, function(config, name) {
			$stateProvider.state(name, config);
		});
	}
]);
