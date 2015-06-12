(function() {
	/**
	 * @factory ProfileService
	 */
	function ProfileService($http) {
		function update(profile) {
			return $http.post('/user', profile);
		}

		function findOne(id) {
			return $http.get('/user/' + id).then(function(response) {
				return response.data || null;
			});
		}

		return {
			findOne: findOne,
			update: update
		};
	}

	$module.factory('ProfileService', ProfileService);
})();
