angular.module('app')
    .controller("SurgeonDashboardController", function ($scope, VendorService, $interval, DialogService, $http, ArticleService) {

        $scope.getAllPremium = function () {
            VendorService.allPremium()
                .then(function (success) {
                    $scope.premiums = success.data;

                    $scope.currentVendor = $scope.premiums[Math.floor(Math.random() * $scope.premiums.length)];

                    console.log($scope.currentVendor);
                }, angular.noop);
        };

        $scope.showReport = function () {
            DialogService.showViewReportDialog($scope.surgeon)
                .then(function (success) {
                    location.href = "/surgeon/activity";
                }, angular.noop);
        };

        $scope.newArticle = function () {
            ArticleService.createArticle();
        };

        $http({
            url: "/surgeon/mine",
            method: "GET"
        })
            .then(function (success) {
                $scope.surgeon = success.data;
            }, angular.noop)

        $interval(function () {
            $scope.currentVendor = $scope.premiums[Math.floor(Math.random() * $scope.premiums.length)];
        }, 10000, 0);

    });