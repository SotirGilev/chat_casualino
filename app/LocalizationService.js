/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/angularjs/angular-route.d.ts" />
angular.module('localization', []).service('LocalizationService', function ($http) {
    var vm = this;
    vm.menuBool = false;
    vm.setShowMenuBool = function (chatBool) {
        vm.menuBool = chatBool;
    };
    vm.getShowMenuBool = function () {
        return vm.menuBool;
    };
    vm.setENG = function () {
        //Login page
        vm.loginText = "LOGIN";
        vm.inputUsernamePlaceholder = "Username";
        vm.inputPassPlaceholder = "Password";
        vm.spanRequired = "This field is required!";
        //Chat page
        vm.home = "Home";
        vm.usersText = "Users";
        vm.searchInUsers = "Search in users..";
        vm.chatInputPlaceholder = "Write something..";
        vm.sendButton = "Send";
        return {
            loginText: vm.loginText,
            inputUsername: vm.inputUsernamePlaceholder,
            inputPassPlaceholder: vm.inputPassPlaceholder,
            spanRequired: vm.spanRequired,
            home: vm.home,
            usersText: vm.usersText,
            searchInUsers: vm.searchInUsers,
            chatInputPlaceholder: vm.chatInputPlaceholder,
            sendButton: vm.sendButton
        };
    };
    vm.setBUL = function () {
        vm.loginText = "ВХОД";
        vm.inputUsernamePlaceholder = "Потребителско име";
        vm.inputPassPlaceholder = "Парола";
        vm.spanRequired = "Това поле е задължително!";
        vm.home = "Начало";
        vm.usersText = "Потребители";
        vm.searchInUsers = "Търси в потребители..";
        vm.chatInputPlaceholder = "Напиши нещо..";
        vm.sendButton = "Прати";
        return {
            loginText: vm.loginText,
            inputUsername: vm.inputUsernamePlaceholder,
            inputPassPlaceholder: vm.inputPassPlaceholder,
            spanRequired: vm.spanRequired,
            home: vm.home,
            usersText: vm.usersText,
            searchInUsers: vm.searchInUsers,
            chatInputPlaceholder: vm.chatInputPlaceholder,
            sendButton: vm.sendButton
        };
    };
});
// angular.module('localization').filter('translate',function ($http) {
//     let vm = this;
//     vm.tran ="";
//    
//     $http.get('eng.json').success(function(data) {
//
//         vm.engJson = data;
//         console.log(vm.engJson);
//         vm.translated = vm.engJson[vm.tran];
//
//     });
//     $http.get('bg.json').success(function(data) {
//
//         vm.bgJson = data;
//         console.log(vm.bgJson);
//
//     });
//    
//    return vm.translated;
//    
// }) 
//# sourceMappingURL=LocalizationService.js.map