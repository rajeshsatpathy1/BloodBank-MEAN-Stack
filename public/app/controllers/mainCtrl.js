angular.module('mainController', ['authServices', 'userServices'])

.controller('mainCtrl', function(Auth, $location, $timeout, $rootScope, User){
    var app = this;

    //Every time there is change in the route check it out
    $rootScope.$on('$routeChangeStart',function(){
        if(Auth.isLoggedIn()){
            app.isLoggedIn = true;
            console.log("Succcess: User has logged in");    
            Auth.getUser().then(function(data){
                //console.log(data.data.username);
                app.username = data.data.username; // To access username from frontend
                app.email = data.data.email;

                User.getPermission().then(function(data){
                    if(data.data.permission === 'admin' || data.data.permission === 'moderator'){
                        app.authorized = true;
                    }else{
                        app.authorized = false;
                    }
                })

            });
        }else{
            app.isLoggedIn = false;
            console.log("Failure: User is not logged in");
            app.username = "";
            app.email = "";
        }
    });

    this.doLogin = function(loginData){
        app.errMsg = false;
        app.successMsg = false;
        app.loading = true;
        //console.log('Form submitted');
        //console.log(this.loginData);
        Auth.login(app.loginData).then(function(data){   //To help in using user creation factory whenever required - defined in userServices
            console.log(data.data.success);
            console.log(data.data.message);

            if(data.data.success){
                app.successMsg = data.data.message + '\n ReDiReCtInG...';
                app.loading = false;
                $timeout(function(){
                    $location.path('/about');   //It was redirected to home in register
                    app.loginData = '';
                    app.successMsg = false;
                },2000);
                }else{
                app.errMsg = data.data.message;
                app.loading = false;
            }
        });
    };

    this.logout = function(){
        Auth.logout();
        $location.path('/logout');
        $timeout(function(){
            $location.path('/');
        },2000);
    }
});