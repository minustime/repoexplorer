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
				controller: 'Home',
				controllerAs: 'vm'
			})
			.when('/organizations/:orgLogin', {
				templateUrl: 'layout/projects.html',
				controller: 'Projects',
				controllerAs: 'vm'
			})
			.when('/organizations/:orgLogin/projects/:repoName', {
				templateUrl: 'layout/project.html',
				controller: 'Project',
				controllerAs: 'vm'
			})
			.otherwise({
				redirectTo: '/'
			});
	}

})();