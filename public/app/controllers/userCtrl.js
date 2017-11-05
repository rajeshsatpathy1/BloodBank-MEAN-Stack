angular.module('userControllers', ['userServices'])

    .controller('regCtrl', function ($http, $location, $timeout, User) {
        var app = this;
        this.regUser = function (regData) {
            app.errMsg = false;
            app.loading = true;
            //console.log('form submited');
            User.create(app.regData).then(function (data) {
                if(data.data.success){
                    app.successMsg = data.data.message + "....Redirecting";
                    app.loading = false;
                    $timeout(function(){
                        $location.path('/');
                    }, 2000);
                    
                }else{
                    app.errMsg = data.data.message;
                    app.loading = false;
                }
            });
        };
    });

