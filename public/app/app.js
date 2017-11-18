angular.module('userApp',['appRoutes','userControllers','userServices','ngAnimate','requestControllers','requestServices','mainController','authServices','managementController'])

.config(function($httpProvider){
    $httpProvider.interceptors.push('AuthInterceptors');
});