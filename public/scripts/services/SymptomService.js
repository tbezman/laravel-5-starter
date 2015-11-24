angular.module('app')
    .factory("SymptomService", function ($http) {

        var SymptomService = {};

        SymptomService.all = function () {
            return $http({
                url: "/symptoms/all",
                method: "GET"
            });
        };

        return SymptomService;
    });