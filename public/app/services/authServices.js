angular.module('authServices', [])

    .factory('Auth', function ($http, AuthToken) {
        var authFactory = {};

        //Auth.login(loginData);
        authFactory.login = function (loginData) {
            return $http.post('/api/authenticate', loginData).then(function (data) {
                //console.log(data.data.token); Check out the token
                AuthToken.setToken(data.data.token);
                return data;
            });
        }

        //Auth.getUser()
        authFactory.getUser = function () {
            if (AuthToken.getToken()) {
                return $http.post('/api/me');
            } else {
                $q.reject({ message: 'User has no token' });
            }
        }
        //Auth.logout();
        authFactory.logout = function () {
            AuthToken.setToken();
        };

        //Auth.isLoggedIn();
        authFactory.isLoggedIn = function () {
            //console.log(AuthToken.getToken());
            if (AuthToken.getToken()) {
                return true;
            } else {
                return false;
            }
        }

        return authFactory;
    })

    .factory('AuthToken', function ($window) {
        var authTokenFactory = {};

        //AuthToken.setToken(token);
        authTokenFactory.setToken = function (token) {
            if (token) {
                $window.localStorage.setItem('token', token);
            } else {
                $window.localStorage.removeItem('token');
            }
        };

        //AuthToken.getToken();
        authTokenFactory.getToken = function () {
            return $window.localStorage.getItem('token');
        };

        return authTokenFactory;
    })

    //To handle tokens for every request made
    .factory('AuthInterceptors', function (AuthToken) {
        var authInterceptorsFactory = {};

        authInterceptorsFactory.request = function (config) {
            var token = AuthToken.getToken();

            if (token) config.headers['x-access-token'] = token;
            return config;
        }

        return authInterceptorsFactory;
    });