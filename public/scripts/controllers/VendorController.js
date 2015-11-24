angular.module('app')
    .controller("VendorController", function ($scope, $http, $location) {

        $scope.getMine = function () {
            $http({
                url: "/vendor/mine",
                method: "GET"
            })
                .then(function (success) {
                    $scope.vendor = success.data;
                    $scope.originalVendor = $.extend(true, {}, $scope.vendor);
                }, angular.noop);
        };

        $scope.getQueryParams = function() {
            var pairs = location.search.slice(1).split('&');

            var result = {};
            pairs.forEach(function(pair) {
                pair = pair.split('=');
                result[pair[0]] = decodeURIComponent(pair[1] || '');
            });

            return JSON.parse(JSON.stringify(result));
        };

        $scope.hasChanged = function (oldVal, newVal) {

            return angular.equals(oldVal, newVal);
        }

        $scope.review = $scope.getQueryParams().review;

        //Are we at the edit path
        var pathSegments = window.location.pathname.split("/");

        if(pathSegments[pathSegments.length - 1] === "edit") {

            $scope.edit = true;

            var id = pathSegments[pathSegments.length - 2];

            $http({
                url: "/vendor/" + id,
                method: "GET"
            })
                .then(function (success) {
                    $scope.vendor = success.data;
                }, angular.noop);
        }

    });
