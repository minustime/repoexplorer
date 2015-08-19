(function() {
	'use strict';

	angular
		.module('app')
		.factory('Org', Org);

	Org.$inject = ['$q', '$window', '$http'];

	/**
	 * Handles Github organization data
	 */
	function Org($q, $window, $http) {

		var orgEndpoint = 'https://api.github.com/orgs/{orgLogin}';
		var reposEndpoint = 'https://api.github.com/orgs/{orgLogin}/repos?page={pageNumber}';
		var repoEndpoint = 'https://api.github.com/repos/{orgLogin}/{repoName}';
		var commitsEndpoint = 'https://api.github.com/repos/{orgLogin}/{repoName}/commits';
		var orgs = {};

		/*

		// This is what the orgs object looks like
		orgs[<orgLogin>] = {
			profile: {},
			repos: [{}],
			recent_commits[<repoName/branch>]: []
		}

		*/

		return {
			getProfile: getProfile,
			getRepos: getRepos,
			getRepo: getRepo,
			getCommits: getCommits,
			getSearchTerm: getSearchTerm()
		};

		function getSearchTerm() {
			return {
				term: ''
			};
		}

		/**
		 * Return a user friendly error message, based on the status we get from Github's API
		 */
		function getFriendlyError(status) {

			var err = {
				message: 'Sorry, something wen\'t wrong, please try again.',
				status: status
			};

			switch(status) {
				case 404:
					err.message = 'Sorry, the organization you entered could not be found.';
					break;
				case 403:
					err.message = 'Sorry, you have reached Github\'s API rate limit.';
					break;
			}

			return err;
		}

		/**
		 * Returns recent project commits
		 */
		function getCommits(orgLogin, repoName, branchName) {

			var deferred = $q.defer();
			var org = orgs[orgLogin];
			var commitsKey = repoName + '/' + branchName;

			if(org.recent_commits[commitsKey] && org.recent_commits[commitsKey].length > 0){
				deferred.resolve(org.recent_commits[commitsKey]);
				return deferred.promise;
			}
			else {
				return fetchCommits(orgLogin, repoName, branchName);
			}
		}

		/**
		 * Appends Github app credentials if available, allows higher API rates
		 */
		function addCredentials (endPoint) {

			var credentialsKey = 'GHAppCredentials';
			var credentials = $window.localStorage[credentialsKey];

			if(credentials) {
				credentials = JSON.parse(credentials);
				endPoint += (endPoint.indexOf('?') !== -1 ? '&' : '?') + 'client_id=' + credentials.clientId + '&client_secret=' + credentials.clientSecret;
			}

			return endPoint;
		}

		/**
		 * Fetches recent project commits from Github
		 */
		function fetchCommits(orgLogin, repoName, branchName) {

			var org = orgs[orgLogin];
			var commitsKey = repoName + '/' + branchName;
			var endpoint = addCredentials(commitsEndpoint.replace('{orgLogin}', org.profile.login).replace('{repoName}', repoName));

			return $http.get(endpoint)
				.then(function(response) {

					if(response.data) {
						org.recent_commits[commitsKey] = response.data;
					}

					return response.data;
				})
				.catch(function(err) {
					return $q.reject(getFriendlyError(err.status));
				});
		}

		/**
		 * Returns a specific repo
		 */
		function getRepo(orgLogin, repoName) {

			var deferred = $q.defer();
			var org = orgs[orgLogin];
			var totalRepos = org.repos.length;
			var repo = {};

			// Return the repo from cache
			while(totalRepos--) {
				if(org.repos[totalRepos].name.toLowerCase() === repoName) {
					repo = org.repos[totalRepos];
					break;
				}
			}

			if(repo.id) {
				deferred.resolve(repo);
				return deferred.promise;
			}
			else {
				return fetchRepo(orgLogin, repoName);
			}
		}

		/**
		 * Get a specific organization repo from Github
		 */
		function fetchRepo(orgLogin, repoName) {

			var org = orgs[orgLogin];
			var endpoint = addCredentials(repoEndpoint.replace('{orgLogin}', org.profile.login).replace('{repoName}', repoName));

			return $http.get(endpoint)
				.then(function(response) {

					if(response.data.id) {
						org.repos.push(response.data);
					}

					return response.data;
				})
				.catch(function(err) {
					return $q.reject(getFriendlyError(err.status));
				});
		}

		/**
		 * Returns the organization repositories
		 */
		function getRepos(orgLogin) {

			var deferred = $q.defer();
			var org = orgs[orgLogin];

			if(org.repos.length === org.profile.public_repos) {
				deferred.resolve(org.repos);
				return deferred.promise;
			}
			else {
				return fetchRepos(orgLogin);
			}
		}

		/**
		 * Fetches the organization repositories, caches them
		 */
		function fetchRepos(orgLogin) {

			return fetchReposPaginated(orgLogin)
				.then(function(results) {

					var org = orgs[orgLogin];
					org.repos = [];

					// Get all the repos..
					var reposIndex = results.length;
					while(reposIndex--) {
						var repoIndex = results[reposIndex].data.length;
						while(repoIndex--) {
							org.repos.push(results[reposIndex].data[repoIndex]);
						}
					}

					return org.repos;
				})
				.catch(function(err) {
					return $q.reject(getFriendlyError(err.status));
				});
		}

		/**
		 * Fetches the organization repositories from Github, page by page
		 */
		function fetchReposPaginated(orgLogin) {

			var pages = [];
			var org = orgs[orgLogin];
			var totalPages = Math.ceil(org.profile.public_repos / 30);

			// Github's API returns only 30 repositories per page,
			// let's assemble our calls to retrieve each one of the organization's repo pages

			for(var i = 1; i <= totalPages; i++) {
				pages.push(addCredentials(reposEndpoint.replace('{orgLogin}', org.profile.login).replace('{pageNumber}', i)));
			}

			var promises = pages.map(function (page) {
				return $http({url: page, method: 'GET'});
			});

			return $q.all(promises);
		}

		/**
		 * Returns the organization profile
		 */
		function getProfile(orgLogin) {

			var deferred = $q.defer();
			var org = orgs[orgLogin];

			if(!orgLogin) {
				return $q.reject(getFriendlyError(0));
			}

			// If org exists in cache return it
			if(org) {

				// Controller is expecting a promise, return it as such
				deferred.resolve(org.profile);
				return deferred.promise;
			}
			else {

				// Otherwise fetch from Github, return the promise
				return fetchProfile(orgLogin);
			}
		}

		/**
		 * Fetches the organization profile from Github, caches it
		 */
		function fetchProfile(orgLogin) {

			// Setup the endpoint, add OAuth credentials if available
			var endpoint = addCredentials(orgEndpoint.replace('{orgLogin}', orgLogin));

			return $http.get(endpoint)
				.then(function(response) {

					// Let's cache it
					orgs[orgLogin] = {
						profile: response.data,
						repos: [],
						recent_commits: {}
					};

					return orgs[orgLogin].profile;
				})
				.catch(function(err) {

					// API responded with an error, reject the promise with an error
					return $q.reject(getFriendlyError(err.status));
				});
		}
	}

})();