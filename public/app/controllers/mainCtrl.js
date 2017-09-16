angular.module('mainController', ['authServices'])

.controller('mainCtrl', function(Auth, $location, $timeout){
    var app = this;
    
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
                    },2000);
                    }else{
                    app.errMsg = data.data.message;
                    app.loading = false;
                }
            });
        };
});