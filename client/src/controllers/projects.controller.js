(function() {
	'use strict';

	angular
		.module('app')
		.controller('Projects', Projects);

	Projects.$inject = ['$window', '$routeParams', '$filter', 'Org'];

	// Define controller
	function Projects($window, $routeParams, $filter, Org) {

		var vm = this;
		var orderBy = $filter('orderBy');

		vm.org = {};
		vm.projects = [];
		vm.order = function(predicate, reverse) {
			vm.projects = orderBy(vm.projects, predicate, reverse);
		};
		vm.viewRepo = function(repo) {
			$window.location.href = '#/organizations/' + vm.org.login + '/projects/' + repo.name;
		};

		function init() {

			// TODO: show spinner

			var orgLogin = $routeParams.orgLogin.toLowerCase();

			Org.getProfile(orgLogin)
				.then(function(profile) {
					if(profile.id) {

						vm.org = profile;

						Org.getRepos(orgLogin)
							.then(function(projects) {
								vm.projects = projects;
								vm.order('stargazers_count', true);
							});
					}
					else {
						// TODO: show error message, organization does not exist..
					}
				});
		}

		init();
	}
})();