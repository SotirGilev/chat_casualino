/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/angularjs/angular-route.d.ts" />
/// <reference path="./ChatCtrl.ts" />

angular.module('chat').directive('enterDirective', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.enterDirective);
                });

                event.preventDefault();
            }

        });
        scope.$on('$destroy',function () {
            element.off('keydown keypress');
        })
    };
});