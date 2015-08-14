(function() {
	'use strict';

	angular
		.module('app')
		.controller('Home', Home);

	Home.$inject = ['$window', 'Org'];

	/**
	 * Home controller,  handles initial organization lookup
	 */
	function Home($window, Org) {

		var vm = this;

		vm.orgLogin = '';
		vm.getProfile = getProfile;

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
	}
})();