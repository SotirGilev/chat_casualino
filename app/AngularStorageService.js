/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/angularjs/angular-route.d.ts" />
angular.module('myApp').service('UserService', function (store) {
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
});
//# sourceMappingURL=AngularStorageService.js.map