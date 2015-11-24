angular.module('app')
    .factory("ASCService", function ($http) {

        var ASCService = {};

        ASCService.all = function () {
            return $http({
                url: "/asc/",
                method: "GET"
            });
        };

        return ASCService;

    });