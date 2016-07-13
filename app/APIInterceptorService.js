/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/angularjs/angular-route.d.ts" />
angular.module('myApp').service('APIInterceptor', function ($rootScope, UserService) {
    var service = this;
    service.request = function (config) {
        var currentUser = UserService.getCurrentUser(), access_token = currentUser ? currentUser.access_token : null;
        console.log("APIInterceptor " + access_token);
        if (access_token) {
            config.headers.authorization = access_token;
        }
        console.log("APIInterceptor config: ", config);
        return config;
    };
    service.responseError = function (response) {
        if (response.status === 401) {
            $rootScope.$broadcast('unauthorized');
        }
        console.log("APIInterceptor unauthorized: ", response);
        return response;
    };
});
//# sourceMappingURL=APIInterceptorService.js.map