(function() {
	'use strict';

	angular
		.module('app')
		.factory('Org', Org);

	Org.$inject = ['$q', '$http'];

	/**
	 * Handles organization profile and projects
	 * @param $q
	 * @param $http
	 * @returns {{getProfile: getProfile, getRepos: getRepos}}
	 * @constructor
	 */
	function Org($q, $http) {

		var orgEndpoint = 'https://api.github.com/orgs/{orgLogin}';
		var reposEndpoint = 'https://api.github.com/orgs/{orgLogin}/repos?page={pageNumber}';
		var repoEndpoint = 'https://api.github.com/repos/{orgLogin}/{repoName}';
		var commitsEndpoint = 'https://api.github.com/repos/{orgLogin}/{repoName}/commits';
		var orgs = {};

		return {
			getProfile: getProfile,
			getRepos: getRepos,
			getRepo: getRepo,
			getCommits: getCommits
		};

		/*

		orgs[id] = {
			profile: {},
			repos: [
				{}
				meta: {},
				branches[branch]: {
					commits: []
				}
			]
		}

		*/


		function getCommits(orgLogin, repoName, branchName) {

			var deferred = $q.defer();
			//var isRepoCached = org.project.id && org.project.name.toLowerCase() === org.project.name.toLowerCase();

			//if(isRepoCached) {
			if(1 === -1){
				deferred.resolve(org.project);
				return deferred.promise;
			}
			else {
				return fetchCommits(orgLogin, repoName, branchName);
			}
		}

		function fetchCommits(orgLogin, repoName, branchName) {

			var org = orgs[orgLogin];

			return $http.get(commitsEndpoint.replace('{orgLogin}', org.profile.login).replace('{repoName}', repoName))
				.then(function(response) {

					if(response.data.id) {
						//org.project = response.data;
					}

					return response.data;
				})
				.catch(function() {
					return [];
				});
		}

		function getRepo(orgLogin, repoName) {

			var deferred = $q.defer();
			var org = orgs[orgLogin];
			var totalProjects = org.projects.length;
			var repo = {};

			// does repo exist..
			while(totalProjects--) {
				if(org.projects[totalProjects].name.toLowerCase() === repoName) {
					repo = org.projects[totalProjects];
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

		function fetchRepo(orgLogin, repoName) {

			var org = orgs[orgLogin];

			return $http.get(repoEndpoint.replace('{orgLogin}', org.profile.login).replace('{repoName}', repoName))
				.then(function(response) {

					if(response.data.id) {
						//org.projects.push(response.data);
					}

					return response.data;
				})
				.catch(function() {
					return {};
				});
		}

		/**
		 * Returns the organization's projects
		 * @returns {org.profile|{}}
		 */
		function getRepos(orgLogin) {

			var deferred = $q.defer();
			var org = orgs[orgLogin];

			if(org.projects.length > 0) {
				deferred.resolve(org.projects);
				return deferred.promise;
			}
			else {
				return fetchRepos(orgLogin);
			}
		}

		/**
		 * Fetches all repositories for org, needs to be done paginated
		 * @returns {Promise}
		 */
		function fetchReposPaginated(orgLogin) {

			var pages = [];
			var org = orgs[orgLogin];
			var totalPages = Math.ceil(org.profile.public_repos / 30);

			for(var i = 1; i <= totalPages; i++) {
				pages.push(reposEndpoint.replace('{orgLogin}', org.profile.login).replace('{pageNumber}', i));
			}

			var promises = pages.map(function (page) {
				return $http({url: page, method: 'GET'});
			});

			return $q.all(promises);
		}

		/**
		 * Fetches the org's repositories
		 * @returns {*}
		 */
		function fetchRepos(orgLogin) {

			return fetchReposPaginated(orgLogin)
				.then(function(results) {

					var org = orgs[orgLogin];
					org.projects = [];

					// Get all the repos..
					var reposIndex = results.length;
					while(reposIndex--) {
						var repoIndex = results[reposIndex].data.length;
						while(repoIndex--) {
							org.projects.push(results[reposIndex].data[repoIndex]);
						}
					}

					return org.projects;
				})
				.catch(function() {
					return org.projects;
				});
		}


		/**
		 * Returns the organization profile
		 * @param orgLogin Github organization login id
		 * @returns {*} Promise
		 */
		function getProfile(orgLogin) {

			var deferred = $q.defer();
			var org = orgs[orgLogin];

			if(org) {
				deferred.resolve(org.profile);
				console.log(orgs)
				return deferred.promise;
			}
			else {
				return fetchProfile(orgLogin);
			}
		}

		/**
		 * Fetches the organization profile from Github, caches it
		 * @param orgLogin Github organization login id
		 * @returns {*} Promise
		 */
		function fetchProfile(orgLogin) {

			return $http.get(orgEndpoint.replace('{orgLogin}', orgLogin))
				.then(function(response) {

					// If the id exists, then the org is good
					if(response.data.id) {
						orgs[orgLogin] = {
							profile: response.data,
							projects: []
						};

						return orgs[orgLogin].profile;
					}
					else {
						return {};
					}

				})
				.catch(function() {
					return {};
				});
		}
	}

})();