(function() {
	'use strict';

	angular
		.module('app', ['ngRoute']);

	// Configure routes
	angular
		.module('app')
		.config(config);

	function config($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'layout/home.html',
				controller: 'Search',
				controllerAs: 'vm'
			})
			.when('/organizations/:orgLogin/repos', {
				templateUrl: 'layout/repos.html',
				controller: 'Repos',
				controllerAs: 'vm'
			})
			.when('/organizations/:orgLogin/repos/:repoName', {
				templateUrl: 'layout/repo.html',
				controller: 'Repo',
				controllerAs: 'vm'
			})
			.otherwise({
				redirectTo: '/'
			});
	}

})();