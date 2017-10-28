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

    .when('/management',{
        templateUrl: 'app/pages/management/management.html',
        controller: 'managementCtrl',
        controllerAs: 'management',
        authenticated: true,
        permission: ['admin', 'moderator']
    })

    .when('/edit/:id',{
        templateUrl: 'app/pages/management/edit.html',
        controller: 'editCtrl',
        controllerAs: 'edit',
        authenticated: true,
        permission: ['admin', 'moderator']
    })
    
    .otherwise({redirectTo: '/'});


    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
      });
});

// Run a check on each route to see if user is logged in or not (depending on if it is specified in the individual route)
app.run(['$rootScope', 'Auth', '$location', 'User', function($rootScope, Auth, $location, User) { 
        $rootScope.$on('$routeChangeStart', function(event, next, current) {
            if (next.$$route !== undefined) {
                if (next.$$route.authenticated === true) {

                    if (!Auth.isLoggedIn()) {
                        event.preventDefault(); // If not logged in, prevent accessing route
                        $location.path('/'); // Redirect to home instead
                    } else if (next.$$route.permission) {
                        // Function: Get current user's permission to see if authorized on route
                        User.getPermission().then(function(data) {
                            if(next.$$route.permission[0] !== data.data.permission){
                                if(next.$$route.permission[1] !== data.data.permission){
                                    event.preventDefault(); //if not admin or moderator prevent accessing route
                                    $location.path('/');     //set location path to home if the route is not working
                                }
                            }
                        });
                    }
                } else if (next.$$route.authenticated === false) {
                    // If authentication is not required, make sure is not logged in
                    if (Auth.isLoggedIn()) {
                        event.preventDefault(); // If user is logged in, prevent accessing route
                        $location.path('/profile'); // Redirect to profile instead
                    }
                }
            }
        });
    }]);