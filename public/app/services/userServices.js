angular.module('userServices', [])

    .factory('User', function ($http) {
        var userFactory = {};

        userFactory.create = function (regData) {
            return $http.post('/api/users', regData);
        }

        userFactory.checkUsername = function (regData) {
            return $http.post('/api/checkusername', regData);
        };

        userFactory.checkEmail = function (regData) {
            return $http.post('/api/checkemail', regData)
        };

        userFactory.checkMobileNumber = function (regData) {
            return $http.post('/api/checkmobilenumber', regData);
        };

        userFactory.renewSession = function (username) {
            return $http.get('/api/renewToken/' + username);
        };

        userFactory.getPermission = function () {
            return $http.get('/api/permission/');
        };

        userFactory.getUsers = function () {
            return $http.get('/api/management');
        }

        userFactory.deleteUser = function (username) {
            return $http.delete('/api/management/' + username);
        }

        return userFactory;
    })