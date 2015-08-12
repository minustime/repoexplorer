// Set app
angular
	.module('app', ['ngRoute']);

// Get app, config routes
angular
	.module('app')
	.config(config);

function config($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'views/home.html',
			controller: 'Home'
		});
}