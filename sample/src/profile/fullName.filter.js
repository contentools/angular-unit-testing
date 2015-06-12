(function() {
	/**
	 * @filter fullName
	 */
	function fullNameFilter() {
		return function(profile) {
			return (profile.firstName || '') + (profile.lastName ? ' ' + profile.lastName : '');
		};
	}

	$module.filter('fullName', fullNameFilter);
})();
