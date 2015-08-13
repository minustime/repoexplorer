(function() {
	'use strict';

	angular
		.module('app')
		.controller('Project', Project);

	Project.$inject = ['$window', '$routeParams', '$filter', 'Org'];

	// Define controller
	function Project($window, $routeParams, $filter, Org) {

		var vm = this;

		vm.org = {};
		vm.project = [];
		vm.commits = [];
		vm.viewRepo = function(repo) {
			$window.location.href = '#/organizations/' + vm.org.login + '/projects/' + repo.name;
		};

		function init() {

			// TODO: show spinner

			var orgLogin  = $routeParams.orgLogin.toLowerCase();
			var repoName = $routeParams.repoName.toLowerCase();

			Org.getProfile(orgLogin)
				.then(function(profile) {
					if(profile.id) {

						vm.org = profile;

						Org.getRepo(orgLogin, repoName)
							.then(function(project) {
								vm.project = project;
							});

						Org.getCommits(orgLogin, repoName, 'master')
							.then(function(commits) {
								console.log('xxx')
								console.log(commits.length)
								vm.commits = commits;
							});
					}
					else {
						// TODO: show error message, organization does not exist.. redirect to org root
					}
				});
		}

		init();
	}
})();