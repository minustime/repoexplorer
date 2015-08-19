(function() {
    'use strict';

    angular
        .module('app')
        .controller('Credentials', Credentials);

    Credentials.$inject = ['$window'];

    /**
     * Saves Github app credentials in local storage, increases API rate limits
     */
    function Credentials($window) {

        var vm = this;
        var credentialsKey = 'GHAppCredentials';

        vm.clientId = '';
        vm.clientSecret = '';
        vm.isOpen = false;
        vm.toggleDisplay = toggleDisplay;
        vm.addCredentials = addCredentials;
        vm.removeCredentials = removeCredentials;

        init();

        function init() {
            populateCredentials();
        }

        function populateCredentials() {
            var credentials = $window.localStorage[credentialsKey];

            if(credentials) {
                credentials = JSON.parse(credentials);
                vm.clientId = credentials.clientId;
                vm.clientSecret = credentials.clientSecret;
            }
        }

        /**
         * Toggles display flag for view
         */
        function toggleDisplay() {
            populateCredentials();
            vm.isOpen = !vm.isOpen;
        }

        /**
         * Store the OAuth credentials in local storage, close the panel
         */
        function addCredentials() {
            vm.isOpen = false;
            $window.localStorage[credentialsKey] = JSON.stringify({
                clientId:  vm.clientId,
                clientSecret: vm.clientSecret
            });
            $window.alert('Got them!');
        }

        /**
         * Removes the OAuth credentials from local storage
         */
        function removeCredentials() {
            vm.clientId = '';
            vm.clientSecret = '';
            $window.localStorage.removeItem(credentialsKey);
            $window.alert('Gone!');
        }

    }
})();