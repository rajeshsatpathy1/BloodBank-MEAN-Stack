angular.module('managementController', [])

    .controller('managementCtrl', function (User, $scope) {
        var app = this;
        app.loading = true;
        app.accessDenied = true;
        app.errMessage = false;
        app.editAccess = false;
        app.deleteAccess = false;
        app.limitto = 5;
        app.showMoreError = false;
        app.searchLimit = 0;

        function getUsers() {
            User.getUsers().then(function (data) {
                if (data.data.success) {
                    if (data.data.userType === 'admin' || data.data.userType === 'moderator') {
                        app.users = data.data.users;
                        app.loading = false;
                        app.accessDenied = false;
                        if (data.data.userType === 'admin') {
                            app.editAccess = true;
                            app.deleteAccess = true;
                            //console.log("Editing and delete privileges");
                        } else if (data.data.userType === 'moderator') {
                            app.editAccess = true;
                            console.log("only editing privileges");
                        }
                    } else {
                        app.errMessage = "insufficient permissions";
                        app.loading = false;
                    }
                } else {
                    app.errMessage = data.data.message;
                    app.loading = false;
                }
            });
        }

        getUsers();


        app.showMore = function (number) {
            app.showMoreError = false;
            if (number > 0) {
                app.limitto = number;
            } else {
                app.showMoreError = "Enter a valid number";
            }
        };

        app.showAll = function () {
            //console.log("entered");
            app.limitto = undefined;
            app.showMoreError = false;
        }

        app.deleteUser = function (username) {
            User.deleteUser(username).then(function (data) {
                if (data.data.success) {
                    console.log("user deleted");
                    getUsers();
                } else {
                    app.showMoreError = data.data.message;
                }
            });
        }

        app.search = function (searchKeyword, number) {
            if (searchKeyword) {
                if (searchKeyword.length > 0) {
                    app.limitto = 0;
                    $scope.searchFilter = searchKeyword;
                    app.limitto = number;
                } else {
                    $scope.searchFilter = undefined;
                    app.limitto = 0;
                }
            } else {
                $scope.searchFilter = undefined;
                app.limitto = 0;
            }
        }

        app.clear = function () {
            $scope.number = 'clear';
            app.limitto = 0;
            $scope.searchKeyword = undefined;
            $scope.searchFilter = undefined;
            app.showMoreError = false;
        }

        // Function: Perform an advanced, criteria-based search
        app.advancedSearch = function (searchByUsername, searchByEmail, searchByName) {
            // Ensure only to perform advanced search if one of the fields was submitted
            if (searchByUsername || searchByEmail || searchByName) {
                $scope.advancedSearchFilter = {}; // Create the filter object
                if (searchByUsername) {
                    $scope.advancedSearchFilter.username = searchByUsername; // If username keyword was provided, search by username
                }
                if (searchByEmail) {
                    $scope.advancedSearchFilter.email = searchByEmail; // If email keyword was provided, search by email
                }
                if (searchByName) {
                    $scope.advancedSearchFilter.firstName = searchByName; // If name keyword was provided, search by name
                }
                app.searchLimit = undefined; // Clear limit on search results
            }
        };

        // Function: Set sort order of results
        app.sortOrder = function (order) {
            app.sort = order; // Assign sort order variable requested by user
        };
    })


    // Controller: Used to edit users
    .controller('editCtrl', function ($scope) {
        var app = this;
        $scope.usernameTab = 'active';

        app.usernamePhase = function () {
            $scope.usernameTab = 'active';
            $scope.firstNameTab = 'default';
            $scope.lastNameTab = 'default';
            $scope.weightTab = 'default';
            $scope.bloodGroupTab = 'default';
            $scope.genderTab = 'default';
            $scope.dateTab = 'default';
            $scope.mobileNumberTab = 'default';
            $scope.emailTab = 'default';
            $scope.permissionsTab = 'default';
        };

        app.firstNamePhase = function () {
            $scope.usernameTab = 'default';
            $scope.firstNameTab = 'active';
            $scope.lastNameTab = 'default';
            $scope.weightTab = 'default';
            $scope.bloodGroupTab = 'default';
            $scope.genderTab = 'default';
            $scope.dateTab = 'default';
            $scope.mobileNumberTab = 'default';
            $scope.emailTab = 'default';
            $scope.permissionsTab = 'default';
        };

        app.lastNamePhase = function () {
            $scope.usernameTab = 'default';
            $scope.firstNameTab = 'default';
            $scope.lastNameTab = 'active';
            $scope.weightTab = 'default';
            $scope.bloodGroupTab = 'default';
            $scope.genderTab = 'default';
            $scope.dateTab = 'default';
            $scope.mobileNumberTab = 'default';
            $scope.emailTab = 'default';
            $scope.permissionsTab = 'default';
        };

        app.weightPhase = function () {
            $scope.usernameTab = 'default';
            $scope.firstNameTab = 'default';
            $scope.lastNameTab = 'default';
            $scope.weightTab = 'active';
            $scope.bloodGroupTab = 'default';
            $scope.genderTab = 'default';
            $scope.dateTab = 'default';
            $scope.mobileNumberTab = 'default';
            $scope.emailTab = 'default';
            $scope.permissionsTab = 'default';
        };

        app.bloodGroupPhase = function () {
            $scope.usernameTab = 'default';
            $scope.firstNameTab = 'default';
            $scope.lastNameTab = 'default';
            $scope.weightTab = 'default';
            $scope.bloodGroupTab = 'active';
            $scope.genderTab = 'default';
            $scope.dateTab = 'default';
            $scope.mobileNumberTab = 'default';
            $scope.emailTab = 'default';
            $scope.permissionsTab = 'default';
        };

        app.genderPhase = function () {
            $scope.usernameTab = 'default';
            $scope.firstNameTab = 'default';
            $scope.lastNameTab = 'default';
            $scope.weightTab = 'default';
            $scope.bloodGroupTab = 'default';
            $scope.genderTab = 'active';
            $scope.dateTab = 'default';
            $scope.mobileNumberTab = 'default';
            $scope.emailTab = 'default';
            $scope.permissionsTab = 'default';
        };

        app.datePhase = function () {
            $scope.usernameTab = 'default';
            $scope.firstNameTab = 'default';
            $scope.lastNameTab = 'default';
            $scope.weightTab = 'default';
            $scope.bloodGroupTab = 'default';
            $scope.genderTab = 'default';
            $scope.dateTab = 'active';
            $scope.mobileNumberTab = 'default';
            $scope.emailTab = 'default';
            $scope.permissionsTab = 'default';
        };

        app.mobileNumberPhase = function () {
            $scope.usernameTab = 'default';
            $scope.firstNameTab = 'default';
            $scope.lastNameTab = 'default';
            $scope.weightTab = 'default';
            $scope.bloodGroupTab = 'default';
            $scope.genderTab = 'default';
            $scope.dateTab = 'default';
            $scope.mobileNumberTab = 'active';
            $scope.emailTab = 'default';
            $scope.permissionsTab = 'default';
        };

        app.emailPhase = function () {
            $scope.usernameTab = 'default';
            $scope.firstNameTab = 'default';
            $scope.lastNameTab = 'default';
            $scope.weightTab = 'default';
            $scope.bloodGroupTab = 'default';
            $scope.genderTab = 'default';
            $scope.dateTab = 'default';
            $scope.mobileNumberTab = 'default';
            $scope.emailTab = 'active';
            $scope.permissionsTab = 'default';
        };

        app.permissionsPhase = function () {
            $scope.usernameTab = 'default';
            $scope.firstNameTab = 'default';
            $scope.lastNameTab = 'default';
            $scope.weightTab = 'default';
            $scope.bloodGroupTab = 'default';
            $scope.genderTab = 'default';
            $scope.dateTab = 'default';
            $scope.mobileNumberTab = 'default';
            $scope.emailTab = 'default';
            $scope.permissionsTab = 'active';
        };

    });