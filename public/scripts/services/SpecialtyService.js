angular.module('app')
    .factory("SpecialtyService", function ($http) {

        var SpecialtyService = {};

        SpecialtyService.all = function () {
            return $http({
                url: "/specialty",
                method: "GET"
            });
        }

        return SpecialtyService;
    });