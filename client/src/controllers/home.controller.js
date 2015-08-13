(function() {
	'use strict';

	angular
		.module('app')
		.controller('Home', Home);

	Home.$inject = ['$window', 'Org'];

	// Define controller
	function Home($window, Org) {

		var vm = this;

		vm.orgLogin = '';
		vm.getProfile = getProfile;

		function getProfile() {

			// TODO: add spinner..

			return Org.getProfile(vm.orgLogin.toLowerCase())
				.then(function(profile) {
					if(profile.id) {
						$window.location.href = '#/organizations/' + profile.login + '/repos';
					}
					else {
						// TODO: add friendly error message
						alert('Organization not found');
					}
				});
		}
	}
})();