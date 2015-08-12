angular
	.module('app')
	.controller('Home', Home);

Home.$inject = ['$location'];

// Define controller
function Home($location) {
	console.log('test')
}