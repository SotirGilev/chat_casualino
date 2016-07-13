/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/angularjs/angular-route.d.ts" />
/// <reference path="../app/socket.d.ts" />
/// <reference path="./ChatCtrl.ts" />

angular.module('chat').config(function($routeProvider) {
    $routeProvider
        .when("/chat", {
            templateUrl : "./chat/chat.html",
            controller: "ChatController"
        })
})
