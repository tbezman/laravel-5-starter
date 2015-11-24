angular.module('app')
    .controller("ApplicationsController", function ($scope, $http, DialogService) {

        $scope.getDisapproved = function () {
            $http({
                url: "/dashboard/disapproved",
                method: "GET"
            })
                .then(function (success) {
                    $scope.disapproved = success.data;
                }, angular.noop);
        };

        $scope.reviewSurgeon = function (surgeon) {
            $scope.reviewType(surgeon, 'surgeon');
        };

        $scope.reviewEmployer = function (employer) {
            $scope.reviewType(employer, 'employer');
        };

        $scope.reviewASC = function (asc) {
            $scope.reviewType(asc, 'asc');
        };

        $scope.reviewAnesthesiologist = function (anesthesiologist) {
            $scope.reviewType(anesthesiologist, 'anesthesiologist');
        };

        $scope.reviewVendor = function (vendor) {
            $scope.reviewType(vendor, 'vendor');
        };

        $scope.reviewType = function (surgeon, type) {
            DialogService.reviewItemDialog(surgeon, type)
                .then(function (success) {
                    location.href = "/" + type + "/" + surgeon.id + "/approve?reason=" + success;
                }, function (error) {
                    if(error) {
                        location.href = "/" + type + "/" + surgeon.id + "/delete?reason=" + error;
                    }
                });
        }


    });