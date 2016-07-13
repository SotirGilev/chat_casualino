/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/angularjs/angular-route.d.ts" />
/// <reference path="../app/socket.d.ts" />
/// <reference path="./LoginCtrl.ts" />

angular.module('login').service('LoginService', function ($rootScope, $location,$http) {
    
    let vm = this;
    vm.check = check;
    vm.getNick = getNick;
    vm.returnNick = returnNick;
    vm.username = "";
    vm.initial = "";
    function check(username,password){
        return $http.post('/login',{username: username,password:password})
            .then(function(response) {
                return response.data;
            })
            .catch(function(error) {
                alert(error);
                throw error;
            });
        /*.then(function (data) {
            if(data.username == 'admin' || data.username == 'user'){
                alert("Successfuly logged in!");
                $location.path("/chat");
            }else{
                alert("Not a valid user!");
                $location.path("/");
                
            }
        }).catch(function (error) {
            alert(status + " Error " + error);
        });*/
        // if(username == "admin" && password == "admin"){
        //     $location.path("/chat");
        //     socket.emit('nickname','admin');
        // }else if(username == "user" && password == "user"){
        //     $location.path("/chat");
        //     socket.emit('nickname','user');
        // }else{
        //     $location.path("/");
        //     alert("Not a valid user!");
        //   
        // },
    }
    function getNick(nick,initial){
        vm.username = nick;
        vm.initial = initial;
    }
    function returnNick(){
        return {
            nick:vm.username,
            initial:vm.initial
        }
    }
    
    
})
