/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/angularjs/angular-route.d.ts" />
/// <reference path="./ChatCtrl.ts" />
angular.module('chat').directive('scrollDirective', function ($rootScope, $timeout) {
    var link = function ($scope, $element, $attr) {
        var listener = $rootScope.$on('scroll', function () {
            $timeout(function () {
                $element[0].scrollTop = $element[0].scrollHeight;
                console.log("objDIV HEIGHT " + $element[0].scrollHeight);
            }, 300);
        });
        $scope.$on('$destroy', function () {
            listener();
        });
    };
    return {
        link: link,
        restrict: 'A'
    };
});
//# sourceMappingURL=ScrollDirective.js.map