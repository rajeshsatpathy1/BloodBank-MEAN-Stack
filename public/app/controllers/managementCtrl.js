angular.module('managementController', [])

.controller('managementCtrl', function(User){
    var app = this;
    app.loading = true;
    app.accessDenied = true;
    app.errMessage = false;
    app.editAccess = false;
    app.deleteAccess = false;
    app.limitto = 5;
    app.showMoreError = false;

    function getUsers(){
        User.getUsers().then(function(data){
            if(data.data.success){
                if(data.data.permission === 'admin' || data.data.permission === 'moderator'){
                    app.users = data.data.users;
                    app.loading = false;
                    app.accessDenied = false;
                    if(data.data.permission === 'admin'){
                        app.editAccess = true;
                        app.deleteAccess = true;
                        console.log("Editing and delete privileges");
                    }else if(data.data.permission === 'moderator'){
                        app.editAccess = true;
                        console.log("only editing privileges");
                    }
                }else{
                    app.errMessage = "insufficient permissions";
                    app.loading = false;
                }
            }else{
                app.errMessage = data.data.message;
                app.loading = false;
            }
        });
    }

    getUsers();


    app.showMore = function(number){
        app.showMoreError = false;
        if(number > 0){
            app.limitto = number;
        }else{
            app.showMoreError = "Enter a valid number";
        }
    };

    app.showAll = function(){
        //console.log("entered");
        app.limitto = undefined;
        app.showMoreError = false;
    }

    app.deleteUser = function(username){
        User.deleteUser(username).then(function(data){
            if(data.data.success){
                console.log("user deleted");
                getUsers();
            }else{

            }
        });
    }
})

.controller('editCtrl', function(){

});