angular.module('app')
    .controller("AcitivityController", function ($scope, $filter, $http) {

        $scope.today = new Date();

        $scope.getActivityForId = function (id) {
            console.log(id);

            $http({
                url: "/activity/" + id,
                method: "GET"
            })
                .then(function (success) {
                    $scope.mine = success.data;
                }, angular.noop);
        };

        $scope.getMoreInfoDataForMonth = function (month) {

            var returnMonth = null;

            if($scope.mine) {
                $scope.mine.more_info.forEach(function (a) {
                    if (a.month === month) returnMonth = a;
                });
            }

            return returnMonth;
        };

        $scope.getAppointmentDataForMonth = function (month) {

            var returnMonth = null;

            if($scope.mine) {
                $scope.mine.appointment.forEach(function (a) {
                    if (a.month === month) returnMonth = a;
                });
            }

            return returnMonth;
        };

        $scope.getTotalForMonth = function (month) {
            var moreInfoData = $scope.getMoreInfoDataForMonth(month);
            var appointmentData = $scope.getAppointmentDataForMonth(month);

            var sum = 0;
            if (moreInfoData) sum += moreInfoData.count;
            if (appointmentData) sum += appointmentData.count;

            return sum;
        };

        $scope.monthNameForNumber = function (num) {
            var date = new Date();
            date.setMonth(num);

            return $filter('date')(date, 'MMMM');
        };

        $scope.getRange = function (start, end) {
            var returnArray = [];

            for(var i = start; i < end; i++){
                returnArray.push(i);
            }

            return returnArray;
        };

        $scope.params = (function() {
            var pairs = location.search.slice(1).split('&');

            var result = {};
            pairs.forEach(function(pair) {
                pair = pair.split('=');
                result[pair[0]] = decodeURIComponent(pair[1] || '');
            });

            return JSON.parse(JSON.stringify(result));
        })();


    });