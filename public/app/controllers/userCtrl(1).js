angular.module('userControllers', ['userServices'])

    .controller('regCtrl', function ($http, $location, $timeout, User) {
        var app = this;
        this.regUser = function (regData, valid) {
            app.errorMsg = false;
            app.loading = true;
            //console.log('form submited');
            if(valid){
                User.create(app.regData).then(function (data) {
                    if(data.data.success){
                        app.successMsg = data.data.message + "....Redirecting";
                        app.loading = false;
                        $timeout(function(){
                            $location.path('/login');
                        }, 2000);
                        
                    }else{
                        app.errorMsg = data.data.message;
                        app.loading = false;
                    }
                });
            } else {
                app.errorMsg = "Please ensure the form is filled out properly";
                app.loading = false;
            }
        };
    });
 