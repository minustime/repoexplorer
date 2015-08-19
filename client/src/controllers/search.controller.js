(function() {
	'use strict';

	angular
		.module('app')
		.controller('Search', Search);

	Search.$inject = ['$scope', '$location', '$window', 'Org'];

	/**
	 * Handles organization lookup, redirects to organization's repositories screen
	 */
	function Search($scope, $location, $window, Org) {

		var vm = this;

		vm.search = Org.getSearchTerm;
		vm.getProfile = getProfile;
		vm.isHome = true;

		locationCheck();

		$scope.$on('$locationChangeSuccess', locationCheck);

		/**
		 * Checks if we're in the home page
		 */
		function locationCheck() {
			vm.isHome = $location.path() === '/';
		}

		/**
		 * Returns the organization's profile, redirects accordingly
		 */
		function getProfile() {

			// TODO: show loading spinner

			Org.getProfile(vm.search.term.toLowerCase())
				.then(showRepos)
				.catch(showErrors);
		}

		/**
		 * Navigate to the organization's repositories screen
		 */
		function showRepos (profile) {
			$window.location.href = '#/organizations/' + profile.login + '/repos';
		}

		/**
		 * Display errors received from the service
		 */
		function showErrors (err) {
			$window.alert(err.message);
		}

	}
})();