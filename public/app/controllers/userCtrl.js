angular.module('userControllers', ['userServices'])

.controller('regCtrl', function($http, $location, $timeout, User){
    var app = this;

    this.regUser = function(regData, valid){
        app.errMsg = false;
        app.successMsg = false;
        app.loading = true;
        //console.log('Form submitted');
        //console.log(this.regData);

        if(valid){
            User.create(app.regData).then(function(data){   //To help in using user creation factory whenever required - defined in userServices
                //console.log(data.data.success);
                //console.log(data.data.message);

                if(data.data.success){
                    app.successMsg = data.data.message + '\n ReDiReCtInG...';
                    app.loading = false;
                    $timeout(function(){
                        $location.path('/');
                    },2000);
                    }else{
                    app.errMsg = data.data.message;
                    app.loading = false;
                }
            });
        }else{
            app.errMsg = "Please make sure to fill all the fields correctly!";
            app.loading = false;
        }
    };
});

//location - specifies path
//timeout - takes a function and delay time as parameters