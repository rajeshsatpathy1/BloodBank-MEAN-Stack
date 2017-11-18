var app = angular.module('appRoutes', ['ngRoute'])

    .config(function ($routeProvider, $locationProvider) {
        $routeProvider

            .when('/', {
                templateUrl: 'app/views/pages/about.html'
            })

            .when('/about', {
                templateUrl: 'app/views/pages/about.html'
            })

            .when('/bloodtips', {
                templateUrl: 'app/views/pages/bloodtips.html'
            })

            .when('/login', {
                templateUrl: 'app/views/pages/users/login.html',
                authenticated: false
            })

            .when('/profile', {
                templateUrl: 'app/views/pages/users/profile.html',
                authenticated: true
            })

            .when('/logout', {
                authenticated: true
            })

            .when('/requestblood', {
                templateUrl: 'app/views/pages/requestblood.html',
                controller: 'reqCtrl',
                controllerAs: 'request'
            })

            .when('/register', {
                templateUrl: 'app/views/pages/users/register.html',
                controller: 'regCtrl',
                controllerAs: 'register',
                authenticated: false
            })

            .when('/management', {
                templateUrl: 'app/views/pages/management/management.html',
                controller: 'managementCtrl',
                controllerAs: 'management',
                authenticated: true,
                userType: ['admin', 'moderator']
            })

            .when('/edit/:id', {
                templateUrl: 'app/views/pages/management/edit.html',
                controller: 'editCtrl',
                controllerAs: 'edit',
                authenticated: true,
                userType: ['admin', 'moderator']
            })

            .when('/search', {
                templateUrl: 'app/views/pages/management/search.html',
                controller: 'managementCtrl',
                controllerAs: 'management',
                authenticated: true,
                userType: ['admin', 'moderator']
            })

            .otherwise({ redirectTo: '/' });

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    });


app.run(['$rootScope', 'Auth', '$location', 'User', function ($rootScope, Auth, $location, User) {
    $rootScope.$on('$routeChangeStart', function (event, next, current) {
        if (next.$$route.authenticated == true) {
            if (!Auth.isLoggedIn()) {
                event.preventDefault();
                $location.path('/');
            }else if(next.$$route.userType){
                User.getPermission().then(function(data){
                    if(next.$$route.userType[0] !== data.data.userType){
                        if(next.$$route.userType[1] !== data.data.userType){
                            event.preventDefault(); //if not admin or moderator prevent accessing route
                            $location.path('/');     //set location path to home if the route is not working
                        }
                    }
                });
            }
        } else if (next.$$route.authenticated == false) {
            if (Auth.isLoggedIn()) {
                event.preventDefault();
                $location.path('/profile');
            }
        }
    });
}]);