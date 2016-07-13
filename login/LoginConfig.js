/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/angularjs/angular-route.d.ts" />
/// <reference path="../app/socket.d.ts" />
/// <reference path="./LoginCtrl.ts" />
angular.module('login').config(function ($routeProvider) {
    $routeProvider
        .when("/", {
        templateUrl: "login/login.html",
        controller: "LoginController"
    });
});
//# sourceMappingURL=LoginConfig.js.map