(function() {
	/**
	 * @controller ProfileViewController
	 */
	function ProfileViewController(profile) {
		var vm = this;
		vm.profile = profile;
	}

	$module.controller('ProfileViewController', ProfileViewController);
})();
