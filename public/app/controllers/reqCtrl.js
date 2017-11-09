angular.module('requestControllers', ['requestServices'])

    .controller('reqCtrl', function ($http, $location, $timeout, Request) {
        var app = this;
        this.reqBlood = function (reqData, valid) {
            app.errorMsg = false;
            app.loading = true;
            //console.log('form submited');
            //console.log(this.reqData);
            if(valid){
                Request.create(app.reqData).then(function (data) {
                    if(data.data.success){
                        app.successMsg = data.data.message + "....Redirecting";
                        app.loading = false;
                        $timeout(function(){
                            $location.path('/');
                        }, 2000);
                        
                    }else{
                        app.errorMsg = data.data.message;
                        app.loading = false;
                    }
                });
            } else {
                app.errorMsg = "Please ensure form is filled properly";
                app.loading = false;
            }
        };
    });
 