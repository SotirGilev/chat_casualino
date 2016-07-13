/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/angularjs/angular-route.d.ts" />
/// <reference path="./socket.d.ts" />
/// <reference path="./LoadService.ts" />

angular.module('login').filter('searchFor', function($http,$q,LoadService){
    let vm = this;


    LoadService.searchForKey().then(function (data) {

        vm.translations = data;
        console.log(vm.translations);

    })
    return function (key) {
        console.log(vm.translations);
        return vm.translations[key];
    }

    // return function (key) {
    //     console.log(key);
    //     //vm.engJson = {};
    //
    //
    //
    //     var promise = $http.get('eng.json')/*.success(function(data) {
    //
    //     })*/.then(function (payloaddata) {
    //         vm.result ="";
    //         console.log(payloaddata);
    //
    //         vm.result = payloaddata.data[key];
    //         console.log(vm.result);
    //         return vm.result;
    //     })
    //
    //     // var wor = promise.then(function (data) {
    //     //     vm.result = data.data[key];
    //     //     console.log(vm.result);
    //     //     return vm.result;
    //     // })
    //     //console.log(vm.result);
    //     //console.log(vm.engJson[key]);
    //
    //     vm.resultWithKey = $q.defer();
    //
    //     vm.resultWithKey.resolve(promise);
    //
    //     //vm.resultWithKey.reject(reason);
    //     console.log(vm.resultWithKey.promise);
    //     return vm.resultWithKey.promise;
    //
    //
    //
    // }

});