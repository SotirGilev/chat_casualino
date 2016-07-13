/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/angularjs/angular-route.d.ts" />
/// <reference path="../app/socket.d.ts" />
/// <reference path="./LoginCtrl.ts" />


angular.module('login').service('LoginSocketService',function (LoginService) {
    let vm = this;
    vm.returnIsChat = returnIsChat;
    vm.isChat = false;
    socket.on('thename',function (data) {
        var userNick = data;
        var userInitial =  userNick.charAt(0);
        console.log("initial " + userInitial);
        LoginService.getNick(userNick,userInitial);
        // $scope.initRestId = function(){
        //     $scope.$broadcast('userData',{nick:userNick, initial:userInitial});
        // };
    })
    socket.on('userDisconnect',function (data) {
        vm.isChat = data;
    });
    function returnIsChat(){
        return {
            isChat:vm.isChat
        }
    }
})