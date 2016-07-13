/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/angularjs/angular-route.d.ts" />
/// <reference path="../app/socket.d.ts" />
/// <reference path="./ChatCtrl.ts" />
angular.module('chat').run(function ($location, UserService) {
    var vm = this;
    socket.emit('giveMeTheList', "IWantTheList");
    vm.currentUser = UserService.getCurrentUser();
    if (vm.currentUser === null) {
        $location.path('/');
        console.log("not logged!");
    }
});
//# sourceMappingURL=ChatRun.js.map