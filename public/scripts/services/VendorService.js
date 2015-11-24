angular.module('app')
    .factory("VendorService", function ($http) {

        var VendorService = {};

        VendorService.allPremium = function () {
            return $http({
                url: "/vendor/premium",
                method: "GET"
            });
        }

        return VendorService;

    });