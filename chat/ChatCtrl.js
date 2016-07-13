/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/angularjs/angular-route.d.ts" />
/// <reference path="../app/socket.d.ts" />
// var chat = angular.module('chat',['ngRoute',/*'ngAvatar'*//*,'multi-avatar'*/]);
angular.module('chat').controller('ChatController', function ($window, $rootScope, $scope, $compile, LoginService, $location, ChatSocketService, UserService, LocalizationService, LoadService) {
    var vm = this;
    var self = this;
    vm.clickButton = clickButton;
    vm.clickHome = clickHome;
    vm.textChange = textChange;
    vm.deletedText = deletedText;
    vm.changeToENG = changeToENG;
    vm.changeToBUL = changeToBUL;
    vm.changeToEnglish = changeToEnglish;
    vm.changeToBulgarian = changeToBulgarian;
    vm.something = "";
    vm.messages = [];
    vm.output = "";
    vm.userNick = "";
    vm.userInitial = "";
    vm.usersList = [];
    vm.isTyping = false;
    vm.whoIsTyping = [];
    vm.searchInput = "";
    vm.menuClickedLog = false; /*true;//*/
    if (vm.menuClickedLog === null) {
        vm.menuClickedLog = LocalizationService.getShowMenuBool().menuBool;
    }
    $rootScope.$on('menuClick', function (data) {
        vm.menuClickedLog = !vm.menuClickedLog;
        console.log("innnnn ", vm.menuClickedLog);
    });
    if (UserService.getLanguage() !== null) {
        if (UserService.getLanguage() == "BUL") {
            vm.home = "Начало";
            vm.usersText = "Потребители";
            vm.searchInUsers = "Търси в потребители..";
            vm.chatInputPlaceholder = "Напиши нещо..";
            vm.sendButton = "Прати";
        }
        else if (UserService.getLanguage() == "ENG") {
            vm.home = "Home";
            vm.usersText = "Users";
            vm.searchInUsers = "Search in users..";
            vm.chatInputPlaceholder = "Write something..";
            vm.sendButton = "Send";
        }
    }
    else {
        vm.home = "Начало";
        vm.usersText = "Потребители";
        vm.searchInUsers = "Търси в потребители..";
        vm.chatInputPlaceholder = "Напиши нещо..";
        vm.sendButton = "Прати";
    }
    function changeToEnglish() {
        LoadService.changeToEN();
        UserService.setLanguage("ENG");
        $window.location.reload();
    }
    function changeToBulgarian() {
        LoadService.changeToBG();
        UserService.setLanguage("BUL");
        $window.location.reload();
    }
    function changeToENG() {
        vm.home = LocalizationService.setENG().home;
        vm.usersText = LocalizationService.setENG().usersText;
        vm.searchInUsers = LocalizationService.setENG().searchInUsers;
        vm.chatInputPlaceholder = LocalizationService.setENG().chatInputPlaceholder;
        vm.sendButton = LocalizationService.setENG().sendButton;
        UserService.setLanguage("ENG");
    }
    function changeToBUL() {
        vm.home = LocalizationService.setBUL().home;
        vm.usersText = LocalizationService.setBUL().usersText;
        vm.searchInUsers = LocalizationService.setBUL().searchInUsers;
        vm.chatInputPlaceholder = LocalizationService.setBUL().chatInputPlaceholder;
        vm.sendButton = LocalizationService.setBUL().sendButton;
        UserService.setLanguage("BUL");
    }
    //$scope.$on('userData',function (data) {
    vm.userNick = LoginService.returnNick().nick;
    vm.userInitial = LoginService.returnNick().initial;
    //     vm.userNick = data.nick;
    //     vm.userInitial = data.initial;
    //console.log("nick " + vm.userNick);
    // })
    socket.open();
    socket.emit('init');
    $scope.$on('$destroy', function (event) {
        socket.close();
    });
    function textChange() {
        $rootScope.$evalAsync(function () {
            console.log('is typing');
            socket.emit('is-typing', true);
        });
    }
    // $rootScope.$evalAsync(function () {
    //     vm.whoIsTyping = ChatSocketService.returnWhoIsTyping().whoIsTyping;
    //     vm.isTyping = ChatSocketService.returnWhoIsTyping().isTyping;
    //     //vm.whoIsTyping = ChatSocketService.returnWhoIsTyping().whoIsTyping;
    //
    //     console.log("who is typing: " + vm.whoIsTyping);
    // });
    socket.on('who-is-typing', function (data) {
        $rootScope.$evalAsync(function () {
            vm.whoIsTyping.splice(0, vm.whoIsTyping.length);
            for (var i = 0; i < data.lengthOfTypers; i++) {
                vm.whoIsTyping.push(data.listOfWhoIsTyping[i].toString());
            }
            console.log("who is typing: " + vm.whoIsTyping);
        });
    });
    function deletedText() {
        $rootScope.$evalAsync(function () {
            if (vm.something.length === 0) {
                socket.emit('is-not-typing', true);
            }
            else {
                console.log(vm.something.charAt(vm.something.length - 1));
                //vm.something.charAt(vm.something.length-1)
                vm.something = vm.something.substr(0, vm.something.length - 1);
            }
        });
    }
    function clickButton() {
        if (vm.something !== "") {
            socket.emit('msg', self.something);
            vm.something = "";
            socket.emit('is-not-typing', true);
        }
    }
    // $rootScope.$on('scroll',function () {
    //     $timeout(function () {
    //         var objDiv = document.getElementById("chatContainer");
    //         objDiv.scrollTop = objDiv.scrollHeight;
    //         console.log("objDIV HEIGHT " + objDiv.scrollHeight);
    //     },300);
    function clickHome() {
        vm.currentUser = UserService.setCurrentUser(null);
        $location.path("/");
        $rootScope.$emit('homeClick', "clicked");
    }
    $scope.customStyle = {};
    $scope.turnGreen = function () {
        $scope.customStyle.colorClass = "green";
    };
    $scope.turnBlue = function () {
        $scope.customStyle.colorClass = "blue";
    };
    if (ChatSocketService.returnMsg().userNick !== "") {
        vm.userNick = ChatSocketService.returnMsg().userNick;
        console.log("retMsg not null " + vm.userNick);
    }
    else if (UserService.getCurrentUser() !== null) {
        vm.userNick = UserService.getCurrentUser().access_token;
        socket.emit('nickname', vm.userNick);
        console.log("getCurr not null " + vm.userNick);
        $rootScope.$broadcast('authorized');
    }
    else {
        $location.path('/');
    }
    vm.output = ChatSocketService.returnMsg().output;
    vm.messages = ChatSocketService.returnMsg().messages;
    // socket.on('msg_to_all', function (data) {
    //     $rootScope.$evalAsync(function () {
    //         console.log("msg " + data);
    //         vm.userNick = data.nickname;
    //       
    //         vm.output = data.msg;
    //         vm.messages.push(vm.userNick + ": " + vm.output);
    //     });
    // })
    // socket.emit('giveMeTheList',"IWantTheList");
    // socket.on('userslist',function (data) {
    //     $rootScope.$evalAsync(function () {
    //         console.log("list: " + vm.usersList);
    //         vm.usersList.splice(0, vm.usersList.length);
    //         for(var i=0;i<data.lengthUsers;i++){
    //             vm.usersList.push(data.arrayUsers[i].toString());
    //         }
    //
    //         //vm.usersList.push(data.arrayUsers);
    //         console.log(data.arrayUsers + " i : " + " " + " " + data.lengthUsers);
    //         //}
    //         console.log("list-after: " + vm.usersList);
    //     });
    // })
    vm.usersList = ChatSocketService.returnList().list;
    console.log("chatctrl list " + vm.usersList);
    // Compile a piece of HTML containing the directive
    //var element = $compile('<div><ng-avatar initials="'+ vm.userInitial +'"></ng-avatar></div>')($rootScope);
    //$rootScope.$digest();
    //var initial = vm.userInitial.toUpperCase();
    //console.log(initial + " of " + vm.userInitial);
    // var compiled = $compile('<div><ng-avatar initials="'+ vm.userInitial +'"></ng-avatar></div>')($scope, function(cloned, scope){
    //     angular.element(document.getElementById('avatar-directive')).append(cloned);
    // });
    //$compile('<div ng-avatar id="avatarImg" initials="'+ initial +'"></div>')($rootScope);
    //angular.element(document.getElementById('avatar-directive')).append(compiled);
});
// chat.directive('enterDirective', function () {
//     return function (scope, element, attrs) {
//         element.bind("keydown keypress", function (event) {
//             if(event.which === 13) {
//                 scope.$apply(function (){
//                     scope.$eval(attrs.enterDirective);
//                 });
//
//                 event.preventDefault();
//             }
//            
//         });
//         scope.$on('$destroy',function () {
//             element.off('keydown keypress');
//         })
//     };
// });
// chat.directive('chatMessageList', function() {
//     return {
//         scope: {
//             list: '=messages'
//         },
//         template: '<div class="chat-list js-chat-list">' +
//         '<div ng-repeat="message in list">' +
//         '{{message.text}}' +
//         '</div>' +
//         '</div>',
//         link: function(scope, element) {
//             scope.$watchCollection('list', function() {
//                 var $list = $(element).find('.js-chat-list');
//                 var scrollHeight = $list.prop('scrollHeight');
//                 $list.animate({scrollTop: scrollHeight}, 500);
//             });
//         }
//     };
// }); 
//# sourceMappingURL=ChatCtrl.js.map