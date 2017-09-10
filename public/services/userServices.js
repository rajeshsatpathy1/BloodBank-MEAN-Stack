angular.module('userServices', [])

.factory('User', function($http){
    userFactory = {};

    userFactory.create = function(regData){
        return $http.post('/users', regData)
    }

    return userFactory;
})