angular.module('app')
    .controller("ASCController", function ($scope, SpecialtyService, $http, DialogService, $location) {

        $scope.allSpecialties = [];

        $scope.leftSelected = [];
        $scope.rightSelected = [];

        $scope.selectedSpecialties = [];
        $scope.nonSelectedSpecialties = [];

        $scope.moveNonToSelected = function () {

            if($scope.leftSelected.length > 0) {
                $scope.leftSelected.forEach(function (a, index) {
                    $scope.selectedSpecialties.push($scope.specialtyForIdInArray(parseInt(a), $scope.allSpecialties));


                    for (var i = 0; i < $scope.nonSelectedSpecialties.length; i++) {
                        var specialty = $scope.nonSelectedSpecialties[i];

                        if (parseInt(specialty.id) === parseInt(a)) {
                            $scope.nonSelectedSpecialties.splice(i, 1);
                        }
                    }
                });

                $scope.leftSelected = [];
            }
        };

        $scope.moveSelectedToNon = function () {

            if($scope.rightSelected.length > 0) {
                $scope.rightSelected.forEach(function (a, index) {
                    $scope.nonSelectedSpecialties.push($scope.specialtyForIdInArray(parseInt(a), $scope.allSpecialties));

                    for (var i = 0; i < $scope.selectedSpecialties.length; i++) {
                        var specialty = $scope.selectedSpecialties[i];

                        if (parseInt(specialty.id) === parseInt(a)) {
                            $scope.selectedSpecialties.splice(i, 1);
                        }
                    }
                });

                $scope.rightSelected = [];
            }
        };

        $scope.getSelectedJoinedByComma = function () {
            if($scope.selectedSpecialties) {
                return $scope.selectedSpecialties.map(function (a) {
                    return a.id;
                }).join(",");
            }
        };

        $scope.specialtyForIdInArray = function (id, array) {
            for(var key in array) {
                var obj = array[key];

                if (id === parseInt(obj.id)) {
                    return obj;
                }
            }

            return null;
        };

        $scope.initSpecialties = function () {
            if($scope.asc && $scope.allSpecialties) {
                $scope.leftSelected = $scope.asc.specialties.map(function (a) {
                    return a.id;
                });

                $scope.moveNonToSelected();
            }
        };

        $scope.deleteASC = function (ASC, $event) {
            DialogService.deleteItem(ASC, ASC.name, $event)
                .then(function (success) {
                    window.location.href = "/asc/" + ASC.id + "/delete";
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


        SpecialtyService.all()
            .then(function (success) {
                $scope.allSpecialties = success.data.slice();
                $scope.nonSelectedSpecialties = success.data.slice();

                $scope.initSpecialties();
            });

        $scope.review = $scope.getQueryParams().review;

        //Are we at the edit path
        var pathSegments = window.location.pathname.split("/");

        if(pathSegments[pathSegments.length - 1] === "edit") {

            $scope.edit = true;

            var id = pathSegments[pathSegments.length - 2];

            $http({
                url: "/asc/" + id,
                method: "GET"
            })
                .then(function (success) {
                    $scope.asc = success.data;

                    $scope.initSpecialties();
                }, angular.noop);
        }
    });