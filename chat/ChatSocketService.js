/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/angularjs/angular-route.d.ts" />
/// <reference path="../app/socket.d.ts" />
/// <reference path="./ChatCtrl.ts" />
angular.module('chat').service('ChatSocketService', function ($rootScope) {
    var vm = this;
    vm.userNick = '';
    vm.output = '';
    vm.messages = [];
    vm.usersList = [];
    vm.whoIsTyping = [];
    vm.isTyping = "";
    vm.returnMsg = returnMsg;
    vm.returnList = returnList;
    vm.returnWhoIsTyping = returnWhoIsTyping;
    socket.emit('giveMeTheList', "IWantTheList");
    socket.on('msg_to_all', function (data) {
        $rootScope.$evalAsync(function () {
            console.log("msg ", data);
            vm.userNick = data.nickname;
            vm.output = data.msg;
            vm.messages.push(vm.userNick + ": " + vm.output);
            $rootScope.$emit('scroll', "scroll");
        });
    });
    socket.on('userslist', function (data) {
        $rootScope.$evalAsync(function () {
            console.log("list: " + vm.usersList);
            if (vm.usersList !== null) {
                vm.usersList.splice(0, vm.usersList.length);
                for (var i = 0; i < data.lengthUsers; i++) {
                    vm.usersList.push(data.arrayUsers[i].toString());
                }
                //vm.usersList.push(data.arrayUsers);
                console.log(data.arrayUsers + " i : " + " " + " " + data.lengthUsers);
                //}
                console.log("list-after: " + vm.usersList);
            }
        });
    });
    // socket.on('who-is-typing',function (data) {
    //     vm.whoIsTyping.splice(0, vm.whoIsTyping.length);
    //     for(var i=0;i<data.lengthOfTypers;i++){
    //         vm.whoIsTyping.push(data.listOfWhoIsTyping[i].toString());
    //     }
    //     console.log("who is typing: sok.on " + vm.whoIsTyping);
    // })
    function returnWhoIsTyping() {
        return {
            isTyping: vm.isTyping,
            whoIsTyping: vm.whoIsTyping
        };
    }
    function returnMsg() {
        return {
            userNick: vm.userNick,
            output: vm.output,
            messages: vm.messages
        };
    }
    function returnList() {
        return {
            list: vm.usersList
        };
    }
});
//# sourceMappingURL=ChatSocketService.js.map