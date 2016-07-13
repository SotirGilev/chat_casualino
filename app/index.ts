/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/angularjs/angular-route.d.ts" />
declare var io;
declare  var translationENG;
declare  var translationBG;
//var app = angular.module('myApp',['chat','login','ngAvatar','angular-storage']);
var socket = io.connect();
var login = angular.module('login',['ngRoute','load']);
var chat = angular.module('chat',['ngRoute'/*'ngAvatar'*//*,'multi-avatar'*/]);
angular.module("myApp", ["ngRoute","chat","login",'angular-storage','localization']).config(function($routeProvider,$httpProvider) {
    $routeProvider
        // .when("/", {
        //     templateUrl : "login/login.html",
        //     controller: "LoginController"
        //    
        // })
         // .when("/chat", {
         //     templateUrl : "./chat/chat.html",
         //     controller: "ChatController"
         // })
        .otherwise({
            templateUrl : "../login/login.html",
            controller: "LoginController"
        })
    $httpProvider.interceptors.push('APIInterceptor');
        });

    

// angular.module('myApp').run(function ($http) {
//     let vm = this;
//
//     $http.get('eng.json').success(function(data) {
//
//         vm.engJson = data;
//         console.log(vm.engJson);
//         console.log("[0] " + vm.engJson['home']);
//
//     });
//     $http.get('bg.json').success(function(data) {
//
//         vm.bgJson = data;
//         console.log(vm.bgJson);
//
//     });
//
//
// })
$.getJSON('eng.json', function(result){

    translationENG = result;
    console.log(translationENG);




})
$.getJSON('bg.json', function(result){

    translationBG = result;
    console.log(translationBG);




})
 angular.element(document).ready(function() {

         angular.bootstrap(document,['myApp','chat','login','ngAvatar']);


 });

// $http.get('hjb',{username:vm.user,pass:}).then(function (response) {
//    
// }).catch(function (response) {
//    
// })
        
 //   })

//});