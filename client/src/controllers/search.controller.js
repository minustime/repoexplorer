(function() {
	'use strict';

	angular
		.module('app')
		.controller('Search', Search);

	Search.$inject = ['$scope', '$location', '$window', 'Org'];

	/**
	 * Search controller,  handles initial organization lookup
	 */
	function Search($scope, $location, $window, Org) {

		var vm = this;

		vm.orgLogin = '';
		vm.getProfile = getProfile;
		vm.isHome = true;

		// Watch service
		$scope.$watch(
			function() {
				return Org.searchTerm;
			},
			function(newish, oldish) {
				vm.orgLogin = newish;
			}
		);

		// Watch input
		$scope.$watch('vm.orgLogin',
			function(newish, oldish) {
				Org.searchTerm = newish;
			}
		);

		// Signal when we're on the home page
		$scope.$on('$locationChangeSuccess', locationCheck);


		function locationCheck() {
			vm.isHome = $location.path() === '/';
		}

		/**
		 * Returns the organization's profile
		 */
		function getProfile() {

			// TODO: show loading spinner
			Org.getProfile(vm.orgLogin.toLowerCase())
				.then(function(profile) {
					if(profile.id) {
						$window.location.href = '#/organizations/' + profile.login + '/repos';
					}
					else {
						// TODO: add friendly error message
						$window.alert('Sorry, the organization you entered could not be retrieved.');
					}
				});
		}

		locationCheck();
	}
})();