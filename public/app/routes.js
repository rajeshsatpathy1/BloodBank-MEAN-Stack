angular.module('appRoutes', ['ngRoute'])

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
        controllerAs: 'register'
    })

    .when('/login', {
        templateUrl: 'app/pages/login.html'
        //controller: 'mainCtrl',
        //controllerAs: 'main'
    })

    .when('/logout',{
        templateUrl: 'app/pages/logout.html'
    })
    
    .otherwise({redirectTo: '/'});


    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
      });
});
