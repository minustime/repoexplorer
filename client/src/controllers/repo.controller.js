(function() {
	'use strict';

	angular
		.module('app')
		.controller('Repo', Repo);

	Repo.$inject = ['$window', '$routeParams', '$filter', 'Org'];

	/**
	 * Repo controller, brokers repo specific data
	 */
	function Repo($window, $routeParams, $filter, Org) {

		var vm = this;

		vm.org = {};
		vm.repo = [];
		vm.commits = [];
		vm.viewRepo = function(repo) {
			$window.location.href = '#/organizations/' + vm.org.login + '/repos/' + repo.name;
		};

		/**
		 * Grabs initial data for the view
		 */
		function init() {

			// TODO: show loading spinner

			var orgLogin  = $routeParams.orgLogin.toLowerCase();
			var repoName = $routeParams.repoName.toLowerCase();

			Org.getProfile(orgLogin)
				.then(function(profile) {
					if(profile.id) {

						vm.org = profile;

						Org.getRepo(orgLogin, repoName)
							.then(function(repo) {
								vm.repo = repo;
							});

						Org.getCommits(orgLogin, repoName, 'master')
							.then(function(commits) {
								vm.commits = commits;
							});
					}
					else {
						// TODO: add friendly error message
						alert('Sorry, the organization you entered could not be retrieved.');
					}
				});
		}

		init();
	}
})();