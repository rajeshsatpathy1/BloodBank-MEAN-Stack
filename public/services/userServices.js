angular.module('userServices', [])

.factory('User', function($http){
    userFactory = {};

    userFactory.create = function(regData){
        return $http.post('/users', regData)
    };

    userFactory.checkUsername = function(regData){
        return $http.post('/checkusername', regData)
    };

    userFactory.checkEmail = function(regData){
        return $http.post('/checkemail', regData)
    };

    userFactory.getPermission = function(){
        return $http.post('/permission/');
    };

    userFactory.getUsers = function(){
        return $http.post('/management1');
    }

    userFactory.deleteUser = function(username){
        return $http.delete('/management/' + username);
    }
    return userFactory;
})