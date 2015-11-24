function ActivtiyService($http) {
    return {

        getRequests: function () {
            return $http({
                url: "/dashboard/requests",
                method: "GET"
            });
        },

        getApplications: function () {
            return $http({
                url: "/dashboard/disapproved",
                method: "GET"
            });
        }

    }
}

angular.module('app')
    .factory('ActivityService', ActivtiyService);

