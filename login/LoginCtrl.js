/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/angularjs/angular-route.d.ts" />
/// <reference path="../app/socket.d.ts" />
/// <reference path="./LoginService.ts" />
/// <reference path="./LoginSocketService.ts" />
/// <reference path="../app/LoadService.ts" />
// var login = angular.module('login',['ngRoute','load']);
angular.module('login').controller('LoginController', function ($window, $rootScope, $location, $http, LoginService, $scope, LoginSocketService, UserService, LocalizationService, LoadService) {
    var vm = this;
    vm.username = "";
    vm.pass = "";
    vm.submit = submit;
    vm.changeToENG = changeToENG;
    vm.changeToBUL = changeToBUL;
    vm.changeToEnglish = changeToEnglish;
    vm.changeToBulgarian = changeToBulgarian;
    vm.isChat = false;
    vm.user = {};
    vm.currentUser = UserService.getCurrentUser();
    vm.menuClickedLog = false; /*true;//*/
    if (vm.menuClickedLog === null) {
        vm.menuClickedLog = LocalizationService.getShowMenuBool().menuBool;
    }
    $rootScope.$on('menuClick', function (data) {
        vm.menuClickedLog = !vm.menuClickedLog;
        console.log("innnnn ", vm.menuClickedLog);
    });
    if (UserService.getLanguage() != null) {
        if (UserService.getLanguage() == "BUL") {
            vm.loginText = "ВХОД";
            vm.inputUsernamePlaceholder = "Потребителско име";
            vm.inputPassPlaceholder = "Парола";
            vm.spanRequired = "Това поле е задължително!";
        }
        else if (UserService.getLanguage() == "ENG") {
            vm.loginText = "LOGIN";
            vm.inputUsernamePlaceholder = "Username";
            vm.inputPassPlaceholder = "Password";
            vm.spanRequired = "This field is required!";
        }
        else {
            vm.loginText = "ВХОД";
            vm.inputUsernamePlaceholder = "Потребителско име";
            vm.inputPassPlaceholder = "Парола";
            vm.spanRequired = "Това поле е задължително!";
        }
    }
    else {
        vm.loginText = "ВХОД";
        vm.inputUsernamePlaceholder = "Потребителско име";
        vm.inputPassPlaceholder = "Парола";
        vm.spanRequired = "Това поле е задължително!";
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
        vm.loginText = LocalizationService.setENG().loginText;
        vm.inputUsernamePlaceholder = LocalizationService.setENG().inputUsername;
        vm.inputPassPlaceholder = LocalizationService.setENG().inputPassPlaceholder;
        vm.spanRequired = LocalizationService.setENG().spanRequired;
        UserService.setLanguage("ENG");
    }
    function changeToBUL() {
        vm.loginText = LocalizationService.setBUL().loginText;
        vm.inputUsernamePlaceholder = LocalizationService.setBUL().inputUsername;
        vm.inputPassPlaceholder = LocalizationService.setBUL().inputPassPlaceholder;
        vm.spanRequired = LocalizationService.setBUL().spanRequired;
        UserService.setLanguage("BUL");
    }
    // vm.locTest = function (item) {
    //     // note, that inside a Controller, we don't return
    //     // a function as this acts as the returned function!
    //     // $http.get('bg.json').success(function(data) {
    //     //
    //     //     vm.bgJson = data;
    //     //     console.log(vm.bgJson);
    //     //
    //     // });
    //
    //
    // };
    function submit() {
        if (vm.menuClickedLog === true) {
            $rootScope.$emit('submitClick', "clicked");
        }
        if (vm.username != "" && vm.pass != "") {
            vm.isPassEmpty = false;
            vm.isUserEmpty = false;
            LoginService.check(vm.username, vm.pass).then(function (data) {
                console.log("data.nick : " + data.nickname);
                vm.user = { nick: vm.username, id: data.idUser /*pass:vm.pass*/ };
                if (data.nickname == 'admin' || data.nickname == 'user') {
                    alert("Successfuly logged in!");
                    socket.emit('nickname', data.nickname);
                    vm.user.access_token = data.nickname;
                    UserService.setCurrentUser(vm.user);
                    $rootScope.$broadcast('authorized');
                    $location.path("/chat");
                    vm.isChat = true;
                }
                else {
                    alert("Not a valid user or wrong password!");
                    $location.path("/");
                    vm.username = "";
                    vm.pass = "";
                }
            }).catch(function (error) {
                alert(status + " Error " + error);
            });
        }
        if (vm.username == "") {
            vm.isUserEmpty = true;
        }
        if (vm.pass == "") {
            vm.isPassEmpty = true;
        }
        vm.isChat = LoginSocketService.returnIsChat().isChat;
        $rootScope.$on('authorized', function () {
            console.log("authorized");
            vm.currentUser = UserService.getCurrentUser();
            $location.path("/chat");
        });
        $rootScope.$on('unauthorized', function () {
            console.log("unauthorized");
            vm.currentUser = UserService.setCurrentUser(null);
            $location.path("/");
        });
        // socket.on('userDisconnect',function (data) {
        //     vm.isChat = data;
        // });
        // socket.on('thename',function (data) {
        //     var userNick = data;
        //     var userInitial =  userNick.charAt(0);
        //     console.log("initial " + userInitial);
        //     LoginService.getNick(userNick,userInitial);
        //     // $scope.initRestId = function(){
        //     //     $scope.$broadcast('userData',{nick:userNick, initial:userInitial});
        //     // };
        // })
        /*.then(function (data) {
            if(data.username != "Not a valid user!"){
                alert("Successfuly logged in!");
                 $location.path("/chat");
            }else{
                alert("Not a valid user!");
                 $location.path("/");
            }
        }).catch(function (error) {
            alert(status + " Error " + error);
        });*/
    }
});
angular.module('login').run(function ($location, UserService) {
    var vm = this;
    vm.currentUser = UserService.getCurrentUser();
    if (vm.currentUser != null) {
        $location.path('/chat');
    }
});
//# sourceMappingURL=LoginCtrl.js.map