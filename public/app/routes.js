angular.module('appRoutes',['ngRoute'])

.config(function($routeProvider, $locationProvider){
    $routeProvider

    .when('/',{
        templateUrl: 'app/views/pages/home.html'
    })

    .when('/about',{
        templateUrl: 'app/views/pages/about.html'
    })

    .when('/bloodtips',{
        templateUrl: 'app/views/pages/bloodtips.html'
    })

    .when('/requestblood',{
        templateUrl: 'app/views/pages/requestblood.html'
    })

    .when('/register',{
        templateUrl: 'app/views/pages/users/register.html',
        controller: 'regCtrl',
        controllerAs: 'register'
    })

    .otherwise({ redirectTo: '/'});

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});