var app = angular.module('appRoutes', ['ngRoute'])

.config(function($routeProvider, $locationProvider){
    $routeProvider
    
    .when('/', {
        templateUrl: 'app/pages/home.ejs'
    })

    .when('/about', {
        templateUrl: 'app/pages/about.html'
    })

    .when('/register', {
        templateUrl: 'app/pages/register.html',
        controller: 'regCtrl',
        controllerAs: 'register',
        authenticated: false
    })

    .when('/login', {
        templateUrl: 'app/pages/login.html',
        authenticated: false
    })

    .when('/logout',{
        templateUrl: 'app/pages/logout.html',
        authenticated: true
    })

    .when('/profile',{
        templateUrl: 'app/pages/profile.html',
        authenticated: true
    })

    .when('/facebook/:token',{
        templateUrl: 'app/pages/facebook.html'
    })
    
    .otherwise({redirectTo: '/'});


    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
      });
});

app.run(['$rootScope', 'Auth', '$location', function($rootScope, Auth, $location){
    $rootScope.$on('$routeChangeStart', function(event, next, current){
        if(next.$$route.authenticated == true){
            if(!Auth.isLoggedIn()){
                event.preventDefault();
                $location.path('/');
            }
        }else if(next.$$route.authenticated == false){
            if(Auth.isLoggedIn()){
                event.preventDefault();
                $location.path('/profile');
            }
        }else{
            console.log('Authentication does not matter');
        }
    });
}]);
