angular.module('mainController', ['authServices', 'userServices'])

    .controller('mainCtrl', function (Auth, $location, $timeout, $rootScope, $route, User, $window, $interval, AuthToken) {
        var app = this;
        app.loadme = false;
        app.choiceMade = false;
        app.sessionCheckInterval = 2000000;//Frequency of validation of session 
        //NOTE: (sessionCheckInterval) should be less than token expiry time
        app.choiceTimeout = 15000;//Maximum Time given for user to renew their session
        app.logoutAnimationTime = 2000000;//For how much time the logging out model should be displayed 

        app.waitingTime = 2000;//WAITING TIME FOR NORMAL SERVER RESPONSE
        app.responseTime = 4000;//MAX TIME FOR SERVER RESPONSE

        //CHECKING IF SESSION EXPIRED EVERY (sessionCheckInterval) TIME
        app.checkSession = function () {

            //CHECKING LOGIN OR LOGOUT FROM OTHER TABS
            var oldToken = $window.localStorage.getItem('token');
            var sessionChangeInterval = $interval(function () {
                var token = $window.localStorage.getItem('token');
                if (oldToken === null && token != oldToken) {
                    //console.log('logged in');
                    $window.location.reload();
                }
                if(token === null && token != oldToken){
                    //console.log('logged out');
                    $location.path('/login');
                    $window.location.reload();
                }
                if (token != oldToken) {
                    //console.log('renewed');
                    $timeout.cancel(timer);
                    app.choiceMade = true;
                    hideModal();
                    $interval.cancel(sessionChangeInterval);
                    app.checkSession();
                }
                //console.log(oldToken);
                oldToken = token;
                //console.log(oldToken);
            }, app.sessionCheckInterval);

            //IF LOGGED IN CHECK FOR EXPIRY
            if (Auth.isLoggedIn()) {
                app.checkingSession = true;
                var interval = $interval(function () {
                    var token = $window.localStorage.getItem('token');
                    if (token === null) {
                        $interval.cancel(interval);
                        $location.path('/login');
                        $window.location.reload();
                    } else {
                        self.parseJwt = function (token) {
                            var base64Url = token.split('.')[1];
                            var base64 = base64Url.replace('-', '+').replace('_', '/');
                            return JSON.parse($window.atob(base64));
                        }
                        var expireTime = self.parseJwt(token);
                        var timeStamp = Math.floor(Date.now() / 1000);
                        //console.log(expireTime.exp);
                        //console.log(timeStamp);
                        var timeCheck = expireTime.exp - timeStamp;
                        //console.log(timeCheck);
                        if (timeCheck <= (((app.choiceTimeout + app.logoutAnimationTime + app.sessionCheckInterval) / 1000) + 1) && timeCheck > (((app.sessionCheckInterval + app.logoutAnimationTime) / 1000) + 1)) {
                            $interval.cancel(interval);
                            showModal(1);
                        } else if (timeCheck < (((app.sessionCheckInterval + app.logoutAnimationTime) / 1000) + 1)) {
                            $interval.cancel(interval);
                            app.endSession();
                        } else {
                            //console.log('token not yet expired')
                        }
                    }
                }, app.sessionCheckInterval);
            }
        };

        //INITIATE CHECK WHEN USER LOADS PAGE
        app.checkSession();

        /*  METHOD TO SHOW MODAL  
            MODAL 1: SESSION EXPIRED
            MODAL 2: LOGGING OUT    */
        var timer;
        var showModal = function (option) {
            app.choiceMade = false;

            app.modalHeader = undefined;
            app.modalBody = undefined;
            app.hideButton = false;

            if (option === 1) {
                app.hideButton = false;
                //SESSION EXPIRED
                app.modalHeader = 'Session is about to expire';
                app.modalBody = 'Would you like to renew your current session?';
                $("#myModal").modal({ backdrop: "static" });
            } else if (option === 2) {
                app.choiceMade = true;
                //LOGOUT
                app.hideButton = true;
                app.modalHeader = 'Logging out... Please wait...';
                //app.modalBody = '';
                //console.log('logging out');
                $("#myModal").modal({ backdrop: "static" });
                Auth.logout();
                $timeout(function () {
                    //console.log('clearing form and redirecting to login');
                    $location.path('/login');
                }, (app.logoutAnimationTime / 2));
                $timeout(function () {
                    //console.log('logged out and reloading page');
                    hideModal();
                    $timeout(function () {
                        $window.location.reload();
                    }, 200);
                    $route.reload();
                }, app.logoutAnimationTime);
            }
            //If no choice made for (choiceTimeout)
            timer = $timeout(function () {
                if (!app.choiceMade) {
                    app.endSession();
                };
            }, app.choiceTimeout);
        };

        //METHOD TO HIDE MODAL
        var hideModal = function () {
            $("#myModal").modal('hide');
        };

        //RENEW SESSION CHOICE MADE
        app.renewSession = function () {
            $timeout.cancel(timer);
            app.choiceMade = true;
            User.renewSession(app.username).then(function (data) {
                if (data.data.success) {
                    AuthToken.setToken(data.data.token);
                    app.checkSession();
                } else {
                    app.modalBody = data.data.message;
                }
            });
            hideModal();
        };

        //END SESSION CHOICE MADE
        app.endSession = function () {
            $timeout.cancel(timer);
            app.choiceMade = true;
            hideModal();
            $timeout(function () {
                showModal(2);
            }, 1000);
        };

        //EVERY TIME THERE IS CHANGE IN ROUTE DO THIS
        $rootScope.$on('$routeChangeStart', function () {
            //console.log('route change');

            if (!app.checkingSession) app.checkSession();//Iitiate checking session whenever user changes the route

            if (Auth.isLoggedIn()) {
                app.isLoggedIn = true;
                //console.log("Succcess: User has logged in");
                Auth.getUser().then(function (data) {
                    //console.log(data.data.username);
                    //console.log(data.data.email);
                    app.username = data.data.username; // To access username from frontend
                    app.email = data.data.email;

                    User.getPermission().then(function (data) {
                        if (data.data.userType === 'admin' || data.data.userType === 'moderator') {
                            app.authorized = true;
                        } else {
                            app.authorized = false;
                        }
                    })
                    app.loadme = true;
                });
            } else {
                app.isLoggedIn = false;
                app.loadme = true;
                //console.log("Failure: User is not logged in");
                app.username = "";
                app.email = "";
            }
            //if ($location.hash() == '_=_') $location.hash(null);
            app.disabled = false;
            app.errMsg = false;
        });

        //LOGIN
        app.doLogin = function (loginData, valid) {
            app.loginComplete = false;
            app.errMsg = false;
            app.successMsg = false;
            app.loading = true;
            app.disabled = true;
            //console.log('Form submitted');
            //console.log(this.loginData);
            $timeout(function () {
                if (!app.loginComplete) {
                    app.errMsg = 'Error connecting to server.. please wait....';
                    app.loading = false;
                }
            }, app.waitingTime);
            $timeout(function () {
                if (!app.loginComplete) {
                    app.errMsg = 'No response from server.. Plase try after some time...';
                    $timeout(function () {
                        $location.path('/');
                        $window.location.reload();
                    }, 2000);
                }
            }, app.responseTime);
            if (valid) {
                Auth.login(app.loginData).then(function (data) {   //To help in using user creation factory whenever required - defined in userServices
                    //console.log(data.data.success);
                    //console.log(data.data.message);
                    app.loginComplete = true;

                    if (data.data.success) {
                        app.successMsg = data.data.message + '\n Redirecting...';
                        app.loading = false;
                        $timeout(function () {
                            $location.path('/profile');   //It was redirected to home in register
                            //app.loginData.username = '';
                            //app.loginData.password = '';
                            delete app.loginData;
                            app.loginData = new Object();//instead of above statements
                            app.successMsg = false;
                            app.disabled = false;
                            app.checkSession();
                        }, 2000);
                    } else {
                        app.errMsg = data.data.message;
                        app.loading = false;
                        app.disabled = false;
                    }
                });
            } else {
                app.loginComplete = true;
                app.disabled = false;
                app.errMsg = "Ensure you entered all login credentials";
                app.loading = false;
            }
        };

        //LOGOUT
        app.logout = function () {
            showModal(2);
        }
    });