(function() {
	'use strict';

	angular
		.module('app')
		.controller('Repos', Repos);

	Repos.$inject = ['$window', '$routeParams', '$filter', 'Org'];

	/**
	 * Handles organization's repositories page, displays all public repositories
	 */
	function Repos($window, $routeParams, $filter, Org) {

		var vm = this;
		var orderBy = $filter('orderBy');

		vm.org = {};
		vm.repos = [];
		vm.order = order;
		vm.showRepo = showRepo;

		init();

		/**
		 * Grabs the initial data for the view
		 */
		function init() {

			// TODO: show loading spinner

			Org.getProfile($routeParams.orgLogin.toLowerCase())
				.then(getRepos)
				.catch(showErrors);
		}

		/**
		 * Sorts by specified property
		 */
		function order(predicate, reverse) {
			vm.repos = orderBy(vm.repos, predicate, reverse);
		}

		/**
		 * Navigates to a repository page
		 */
		function showRepo(repo) {
			$window.location.href = '#/organizations/' + vm.org.login + '/repos/' + repo.name;
		}

		/**
		 * Get the list of repositories
		 */
		function getRepos(profile) {

			vm.org = profile;

			Org.getRepos(profile.login.toLowerCase())
				.then(function(repos) {
					vm.repos = repos;
					vm.order('stargazers_count', true);
				})
				.catch(showErrors);
		}

		/**
		 * Display errors received from the service
		 */
		function showErrors (err) {
			$window.alert(err.message);
		}
	}
})();