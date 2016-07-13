
$.getJSON('eng.json', function (result) {
    translationENG = result;

});
$.getJSON('bg.json', function (result) {
    translationBG = result;

});
var load = angular.module('load', []);
var chat = angular.module('chat', ['ngRoute']);
var login = angular.module('login', ['ngRoute', 'load']);
var localization = angular.module('localization',[]);
var socket = io.connect();
angular.module("myApp", ["ngRoute", "chat", "login", 'angular-storage', 'localization']).config(["$routeProvider", "$httpProvider", function ($routeProvider, $httpProvider) {
    $routeProvider
        .otherwise({
            templateUrl: "../login/login.html",
            controller: "LoginController"
        });
    $httpProvider.interceptors.push('APIInterceptor');
}]);

angular.element(document).ready(function () {
    angular.bootstrap(document, ['myApp', 'chat', 'login', 'ngAvatar']);
});
angular.module('myApp').service('APIInterceptor', ["$rootScope", "UserService", function ($rootScope, UserService) {
    var service = this;
    service.request = function (config) {
        var currentUser = UserService.getCurrentUser(), access_token = currentUser ? currentUser.access_token : null;
        console.log("APIInterceptor " + access_token);
        if (access_token) {
            config.headers.authorization = access_token;
        }
        console.log("APIInterceptor config: ", config);
        return config;
    };
    service.responseError = function (response) {
        if (response.status === 401) {
            $rootScope.$broadcast('unauthorized');
        }
        console.log("APIInterceptor unauthorized: ", response);
        return response;
    };
}]);
angular.module('myApp').service('UserService', ["store", function (store) {
    var service = this, currentUser = null, language = null;
    service.setCurrentUser = function (user) {
        currentUser = user;
        store.set('user', user);
        if (currentUser != null) {
            console.log("Storage set: " + currentUser.access_token);
        }
        return currentUser;
    };
    service.getCurrentUser = function () {
        if (!currentUser) {
            currentUser = store.get('user');
            console.log("Storage get: " + currentUser);
        }
        return currentUser;
    };
    service.setLanguage = function (chosenLang) {
        language = chosenLang;
        store.set('lang', chosenLang);
        if (language != null) {
            console.log("Storage set lang: " + language);
        }
        return language;
    };
    service.getLanguage = function () {
        if (!language) {
            language = store.get('lang');
            console.log("Storage get lang: " + language);
        }
        return language;
    };
}]);
angular.module('load').service('LoadService', ["$http", "$q", "$timeout", "UserService", function ($http, $q, $timeout, UserService) {
    var vm = this;
    vm.searchForKey = searchForKey;
    vm.changeToEN = changeToEN;
    vm.changeToBG = changeToBG;
    if (UserService.getLanguage() != null) {
        if (UserService.getLanguage() == "BUL") {
            vm.translation = translationBG;
        }
        else if (UserService.getLanguage() == "ENG") {
            vm.translation = translationENG;
        }
        else {
            vm.translation = translationBG;
        }
    }
    function changeToEN() {
        vm.translation = translationENG;
        console.log("changeToEN ", vm.translation);
        vm.searchForKey();
    }
    function changeToBG() {
        vm.translation = translationBG;
        console.log("changeToBG ", vm.translation);
        vm.searchForKey();
    }
    function searchForKey() {
        var deferred = $q.defer();
        console.log(vm.translation);
        deferred.resolve(vm.translation);
        deferred.reject("Error: request returned status " + status);
        return deferred.promise;
    }
}]);
angular.module('login').filter('searchFor', ["$http", "$q", "LoadService", function ($http, $q, LoadService) {
    var vm = this;
    LoadService.searchForKey().then(function (data) {
        vm.translations = data;
        console.log(vm.translations);
    });
    return function (key) {
        console.log(vm.translations);
        return vm.translations[key];
    };
}]);
angular.module('localization').service('LocalizationService', ["$http", function ($http) {
    var vm = this;
    vm.menuBool = false;
    vm.setShowMenuBool = function (chatBool) {
        vm.menuBool = chatBool;
    }
    vm.getShowMenuBool = function () {
        return vm.menuBool;
    }

    vm.setENG = function () {
        vm.loginText = "LOGIN";
        vm.inputUsernamePlaceholder = "Username";
        vm.inputPassPlaceholder = "Password";
        vm.spanRequired = "This field is required!";
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
}]);

var socket = io.connect();
angular.module('chat').directive('backspaceDirective', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 8 || event.which === 46) {
                scope.$apply(function () {
                    scope.$eval(attrs.backspaceDirective);
                });
                event.preventDefault();
            }
        });
        scope.$on('$destroy', function () {
            element.off('keydown keypress');
        });
    };
});
angular.module('chat').config(["$routeProvider", function ($routeProvider) {
    $routeProvider
        .when("/chat", {
        templateUrl: "./chat/chat.html",
        controller: "ChatController"
    });
}]);

chat.controller('ChatController', ["$window", "$rootScope", "$scope", "$compile", "LoginService", "$location", "ChatSocketService", "UserService", "LocalizationService", "LoadService","$timeout", function ($window, $rootScope, $scope, $compile, LoginService, $location, ChatSocketService, UserService, LocalizationService, LoadService, $timeout) {
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

    vm.menuClickedLog = false;/*true;//*/

    if(vm.menuClickedLog === null){
        vm.menuClickedLog = LocalizationService.getShowMenuBool().menuBool;
    }
    $rootScope.$on('menuClick',function (data) {
        vm.menuClickedLog = !vm.menuClickedLog;
        console.log("innnnn ",vm.menuClickedLog);
    })

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
    vm.userNick = LoginService.returnNick().nick;
    vm.userInitial = LoginService.returnNick().initial;
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
    //     }, 300);
    //
    //
    //
    // })





    function clickHome() {
        vm.currentUser = UserService.setCurrentUser(null);
        $location.path("/");
        $rootScope.$emit('homeClick',"clicked");
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
    vm.usersList = ChatSocketService.returnList().list;





}]);
angular.module('chat').directive('scrollDirective',function ($rootScope,$timeout) {


    var link = function ($scope,$element,$attr) {
        var listener = $rootScope.$on('scroll',function () {
            $timeout(function () {
                $element[0].scrollTop = $element[0].scrollHeight;
                console.log("objDIV HEIGHT " + $element[0].scrollHeight);

            }, 300);

        })

        $scope.$on('$destroy',function () {
            listener();
        })


    }
    return {
        link:link,
        restrict: 'A'
    }
})
angular.module('chat').directive('enterDirective', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.enterDirective);
                });
                event.preventDefault();
            }
        });
        scope.$on('$destroy', function () {
            element.off('keydown keypress');
        });
    };
});
angular.module('chat').run(["$location", "UserService", function ($location, UserService) {
    var vm = this;
    socket.emit('giveMeTheList', "IWantTheList");
    vm.currentUser = UserService.getCurrentUser();
    if (vm.currentUser === null) {
        $location.path('/');
        console.log("not logged!");
    }
}]);
angular.module('chat').service('ChatSocketService', ["$rootScope", function ($rootScope) {
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
            $rootScope.$emit('scroll',"scroll");
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
                console.log(data.arrayUsers + " i : " + " " + " " + data.lengthUsers);
                console.log("list-after: " + vm.usersList);
            }
        });
    });
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
}]);
angular.module('login').config(["$routeProvider", function ($routeProvider) {
    $routeProvider
        .when("/", {
        templateUrl: "login/login.html",
        controller: "LoginController"
    });
}]);
login.service('LoginService', ["$rootScope", "$location", "$http", function ($rootScope, $location, $http) {
    var vm = this;
    vm.check = check;
    vm.getNick = getNick;
    vm.returnNick = returnNick;
    vm.username = "";
    vm.initial = "";
    function check(username, password) {
        return $http.post('/login', { username: username, password: password })
            .then(function (response) {
            return response.data;
        })
            .catch(function (error) {
            alert(error);
            throw error;
        });
    }
    function getNick(nick, initial) {
        vm.username = nick;
        vm.initial = initial;
    }
    function returnNick() {
        return {
            nick: vm.username,
            initial: vm.initial
        };
    }
}]);
angular.module('login').service('LoginSocketService', ["LoginService", function (LoginService) {
    var vm = this;
    vm.returnIsChat = returnIsChat;
    vm.isChat = false;
    socket.on('thename', function (data) {
        var userNick = data;
        var userInitial = userNick.charAt(0);

        LoginService.getNick(userNick, userInitial);
    });
    socket.on('userDisconnect', function (data) {
        vm.isChat = data;
    });
    function returnIsChat() {
        return {
            isChat: vm.isChat
        };
    }
}]);

login.controller('LoginController', ["$window", "$rootScope", "$location", "$http", "LoginService", "$scope", "LoginSocketService", "UserService", "LocalizationService", "LoadService", function ($window, $rootScope, $location, $http, LoginService, $scope, LoginSocketService, UserService, LocalizationService, LoadService) {
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
    vm.menuClickedLog = false;/*true;//*/

    if(vm.menuClickedLog === null){
        vm.menuClickedLog = LocalizationService.getShowMenuBool().menuBool;
    }
    $rootScope.$on('menuClick',function (data) {
        vm.menuClickedLog = !vm.menuClickedLog;

    })



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
    function submit() {
        if(vm.menuClickedLog === true){
            $rootScope.$emit('submitClick',"clicked");
        }

        if (vm.username != "" && vm.pass != "") {
            vm.isPassEmpty = false;
            vm.isUserEmpty = false;
            LoginService.check(vm.username, vm.pass).then(function (data) {
                console.log("data.nick : " + data.nickname);
                vm.user = { nick: vm.username, id: data.idUser };
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
    }
}]);
login.run(["$location", "UserService","LocalizationService", function ($location, UserService,LocalizationService) {
    var vm = this;
    vm.currentUser = UserService.getCurrentUser();
    if (vm.currentUser != null) {
        $location.path('/chat');
    }
    //LocalizationService.menuClickedFunc();
}]);
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
