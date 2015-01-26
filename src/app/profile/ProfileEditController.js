(function() {
	/**
	 * @controller ProfileEditController
	 */
	function ProfileEditController(profile, ProfileService) {
		var vm = this;
		vm.profile = profile;
		vm.update = update;

		function update() {
			ProfileService.update(vm.profile);
		}
	}

	$module.controller('ProfileEditController', ProfileEditController);
})();
