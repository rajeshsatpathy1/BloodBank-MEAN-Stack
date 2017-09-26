angular.module('authServices', [])

.factory('Auth', function($http, AuthToken){
    var authFactory = {};

    //Auth.login(loginData);
    authFactory.login = function(loginData){
        return $http.post('/authenticate',loginData).then(function(data){
            console.log(data.data.token);
            AuthToken.setToken(data.data.token);
            return data;
        });
    }

    //Auth.logout();
    authFactory.logout = function(){
        AuthToken.setToken();
    };

    authFactory.isLoggedIn = function(){
        //console.log(AuthToken.getToken());
        if (AuthToken.getToken()){
            return true;
        }else{
            return false;
        }
    }

    return authFactory;
})

.factory('AuthToken', function($window){
    var authTokenFactory = {};

    //AuthToken.setToken(token);
    authTokenFactory.setToken = function(token){
        if(token){
            $window.localStorage.setItem('token', token);
        }else{
            $window.localStorage.removeItem('token');
        }
    };

    //AuthToken.getToken();
    authTokenFactory.getToken = function(){
        return $window.localStorage.getItem('token');
    };

    return authTokenFactory;
});