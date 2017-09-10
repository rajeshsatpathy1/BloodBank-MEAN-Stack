angular.module('userControllers', [])

.controller('regCtrl', function($http){
    var app = this;

    this.regUser = function(regData){
        console.log('Form submitted');
        console.log(this.regData);
        $http.post('/users', this.regData).then(function(data){
            console.log(data.data.success);
            console.log(data.data.message);

            if(data.data.success){
                app.successMsg = data.data.message;
            }else{
                app.errMsg = data.data.message;
            }
        });
    };
});