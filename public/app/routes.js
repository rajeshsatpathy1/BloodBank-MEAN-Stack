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
    
    .otherwise({redirectTo: '/'});


    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
      });
});
