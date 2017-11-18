angular.module('userControllers', ['userServices'])

    .controller('regCtrl', function ($http, $location, $timeout, User, $window) {
        var app = this;
        app.checkingTime = 2000;//MAX TIME FOR CHECKING FIELDS( USERNAME, EMAIL, MOBILE NUMBER)
        app.waitingTime = 2000;//WAITING TIME FOR NORMAL SERVER RESPONSE
        app.responseTime = 4000;//MAX TIME FOR SERVER RESPONSE

        //REGISTER NEW USER
        this.regUser = function (regData, valid) {
            app.regComplete = false;
            app.errorMsg = false;
            app.loading = true;
            //console.log('form submited');
            app.disabled = true;
            //console.log(this.regData);
            $timeout(function () {
                if (!app.regComplete) {
                    app.errorMsg = 'Error connecting to server.. please wait....';
                    app.loading = false;
                }
            }, app.waitingTime);
            $timeout(function () {
                if (!app.regComplete) {
                    app.errorMsg = 'No response from server.. Plase try after some time...';
                    $timeout(function () {
                        $location.path('/');
                        $window.location.reload();
                    }, 2000);
                }
            }, app.responseTime);
            if (valid) {
                User.create(app.regData).then(function (data) {
                    app.regComplete = true;
                    if (data.data.success) {
                        app.successMsg = data.data.message + "....Redirecting";
                        app.loading = false;
                        $timeout(function () {
                            $location.path('/login');
                            delete app.regData;
                            app.regData = new Object();//clear object
                            app.disabled = false;
                        }, 2000);

                    }
                    else if (!data) {
                        console.log('error');
                    } else {
                        app.errorMsg = data.data.message;
                        app.loading = false;
                        app.disabled = false;
                    }
                });
            } else {
                app.regComplete = true;
                app.errorMsg = "Please ensure the form is filled out properly";
                app.loading = false;
                app.disabled = false;
            }
        }

        //CHECKING USERNAME
        this.checkUsername = function (regData) {
            app.checkComplete = false;
            app.checkingUsername = true;
            app.usernameMsg = false;
            app.usernameInvalid = false;
            $timeout(function () {
                if (!app.checkComplete) {
                    app.usernameMsg = 'error validating username'
                    app.checkingUsername = false;
                    app.usernameInvalid = true;
                }
            }, app.checkingTime);
            User.checkUsername(app.regData).then(function (data) {
                if (data.data.success) {
                    app.checkComplete = true;
                    app.usernameInvalid = false;
                    app.usernameMsg = data.data.message;
                    app.checkingUsername = false;
                } else {
                    app.checkComplete = true;
                    //app.checkingUsername = true;//testing checking username
                    app.usernameInvalid = true;
                    app.usernameMsg = data.data.message;
                    app.checkingUsername = false;
                }
            });
        }

        //CHECKING E-MAIL
        this.checkEmail = function (regData) {
            app.checkComplete = false;
            app.checkingEmail = true;
            app.emailMsg = false;
            app.emailInvalid = false;
            $timeout(function () {
                if (!app.checkComplete) {
                    app.emailMsg = 'error validating e-mail'
                    app.checkingEmail = false;
                    app.emailInvalid = true;
                }
            }, app.checkingTime);
            User.checkEmail(app.regData).then(function (data) {
                if (data.data.success) {
                    app.checkComplete = true;
                    app.emailInvalid = false;
                    app.emailMsg = data.data.message;
                    app.checkingEmail = false;
                } else {
                    app.checkComplete = true;
                    app.emailInvalid = true;
                    app.emailMsg = data.data.message;
                    app.checkingEmail = false;
                }
            });
        }

        //CHECKING MOBILE NUMBER
        this.checkMobileNumber = function (regData) {
            app.checkComplete = false;
            app.checkingMobileNumber = true;
            app.mobileNumberMsg = false;
            app.mobileNumberInvalid = false;
            $timeout(function () {
                if (!app.checkComplete) {
                    app.mobileNumberMsg = 'error validating mobile number'
                    app.checkingMobileNumber = false;
                    app.mobileNumberInvalid = true;
                }
            }, app.checkingTime);
            User.checkMobileNumber(app.regData).then(function (data) {
                if (data.data.success) {
                    app.checkComplete = true;
                    app.mobileNumberInvalid = false;
                    app.mobileNumberMsg = data.data.message;
                    app.checkingMobileNumber = false;
                } else {
                    app.checkComplete = true;
                    app.mobileNumberInvalid = true;
                    app.mobileNumberMsg = data.data.message;
                    app.checkingMobileNumber = false;
                }
            });
        }

    })

    .directive('match', function () {
        return {
            restrict: 'A',
            controller: function ($scope) {
                $scope.confirmed = false;
                $scope.doConfirm = function (values) {
                    values.forEach(function (ele) {
                        if ($scope.confirm == ele) {
                            $scope.confirmed = true;
                        } else {
                            $scope.confirmed = false;
                        }
                    });
                }
            },

            link: function (scope, element, attrs) {
                attrs.$observe('match', function () {
                    scope.matches = JSON.parse(attrs.match);
                    scope.doConfirm(scope.matches);
                });

                scope.$watch('confirm', function () {
                    scope.matches = JSON.parse(attrs.match);
                    scope.doConfirm(scope.matches);
                });
            }
        };
    });
