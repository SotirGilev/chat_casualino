/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/angularjs/angular-route.d.ts" />

angular.module("myApp").controller('MenuController', function (LocalizationService,$rootScope) {
    var vm = this;
    vm.menuClicked = false;
    vm.menuClickedFunc = menuClickedFunc;
    function menuClickedFunc() {
        console.log("menu clicked " + vm.menuClicked);
        vm.menuClicked = !vm.menuClicked;
        LocalizationService.setShowMenuBool(vm.menuClicked);
        $rootScope.$broadcast('menuClick',{menu:vm.menuClicked});
    }
    menuClickedFunc();
    $rootScope.$on('submitClick',function (data) {
        vm.menuClickedFunc();
    })
    $rootScope.$on('homeClick',function (data) {
        vm.menuClickedFunc();
    })
});

