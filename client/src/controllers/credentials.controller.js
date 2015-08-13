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

        function toggleDisplay() {
            vm.isOpen = !vm.isOpen;
        };

        function saveCredentials() {

            $window.localStorage[credentialsKey] = JSON.stringify({
                clientId:  vm.clientId,
                clientSecret: vm.clientSecret
            });

            vm.isOpen = false;
            alert('Got it!')
        }

        function init() {
            var credentials = $window.localStorage[credentialsKey];

            if(credentials) {
                credentials = JSON.parse(credentials);
                vm.clientId = credentials.clientId;
                vm.clientSecret = credentials.clientSecret;
            }
        }

        init();
    }
})();