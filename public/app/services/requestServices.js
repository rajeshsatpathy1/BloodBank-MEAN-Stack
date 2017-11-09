angular.module('requestServices', [])

.factory('Request', function($http){
    requestFactory = {};

    requestFactory.create = function(reqData){
        //console.log(reqData);
        return $http.post('/api/requests', reqData);
    }

    return requestFactory;
})