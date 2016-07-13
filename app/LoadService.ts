/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/angularjs/angular-route.d.ts" />

angular.module('load',[]).service('LoadService', function ($http,$q,$timeout,UserService) {

    let vm = this;
    vm.searchForKey = searchForKey;
    vm.changeToEN = changeToEN;
    vm.changeToBG = changeToBG;
    //vm.translation = translationBG;
     // function searchForKey (key) {
     //    console.log(key);
        //vm.engJson = {};
    if( UserService.getLanguage() != null) {
        if (UserService.getLanguage() == "BUL") {
            vm.translation = translationBG;
        } else if (UserService.getLanguage() == "ENG") {
            vm.translation = translationENG;

        } else {
            vm.translation = translationBG;
        }
    }


    
    

        // var promise = $http.get('eng.json')/*.success(function(data) {
        //
        //  })*/.then(function (payloaddata) {
        //     vm.result ="";
        //     vm.q = $q.defer();
        //     console.log(payloaddata);
        //
        //     vm.result = payloaddata.data[key];
        //     console.log(vm.result);
        //     vm.q.resolve(vm.result)
        //     return vm.q.promise;
        // })
        function changeToEN(){
            vm.translation =translationENG;
            console.log("changeToEN ",vm.translation);
            vm.searchForKey();
        }
        function changeToBG(){
            vm.translation=translationBG;
            console.log("changeToBG ",vm.translation);
            vm.searchForKey();
        }

         function searchForKey() {
             // There will always be a promise so always declare it.
             var deferred = $q.defer();
             
             //$http.get('eng.json')
                 //.success(function(data){
                
                 console.log(vm.translation);
                 deferred.resolve(vm.translation);
             //})
    //.error(function(data, status, headers, config) {
                 deferred.reject("Error: request returned status " + status);
             //});
             return deferred.promise;

         }

        // var wor = promise.then(function (data) {
        //     vm.result = data.data[key];
        //     console.log(vm.result);
        //     return vm.result;
        // })
        // console.log(promise);
        //console.log(vm.engJson[key]);

        // vm.resultWithKey = $q.defer();
        //
        // vm.resultWithKey.resolve(promise);

        //vm.resultWithKey.reject(reason);
        // console.log(vm.resultWithKey.promise);
        // return vm.resultWithKey.promise;



    // }
})