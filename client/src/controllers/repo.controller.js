(function() {
	'use strict';

	angular
		.module('app')
		.controller('Repo', Repo);

	Repo.$inject = ['$q', '$window', '$routeParams', '$filter', 'Org'];

	/**
	 * Handles a specific repository page, displays latest commits
	 */
	function Repo($q, $window, $routeParams, $filter, Org) {

		var vm = this;
		var orgLogin;
		var repoName;

		vm.org = {};
		vm.repo = [];
		vm.commits = [];

		init();

		/**
		 * Grabs initial data for the view
		 */
		function init() {

			// TODO: show loading spinner

			orgLogin  = $routeParams.orgLogin.toLowerCase();
			repoName = $routeParams.repoName.toLowerCase();

			Org.getProfile(orgLogin)
				.then(getRepoData)
				.catch(showErrors);
		}

		/**
		 * Get repo meta, get commits
		 */
		function getRepoData(profile) {

			// Save the organization's profile for the view
			vm.org = profile;

			$q.all([
				Org.getRepo(orgLogin, repoName),
				Org.getCommits(orgLogin, repoName, 'master')
			])
			.then(showRepoData)
			.catch(showErrors);
		}

		/**
		 * Make the repo meta and commits available to the view
		 */
		function showRepoData(results) {
			vm.repo = results[0];
			vm.commits = results[1];
		}

		/**
		 * Display errors received from the service
		 */
		function showErrors (err) {
			$window.alert(err.message);
		}
	}
})();