angular.module('authServices', [])

.factory('Auth', function($http){
    var authFactory = {};

    authFactory.login = function(loginData){
        return $http.post('/authenticate',loginData);
    }
    return authFactory;
});