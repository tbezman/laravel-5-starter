angular.module('app')
    .controller("SymptomController", function ($scope, SymptomService, SpecialtyService, $http, DialogService) {

        $scope.allSymptoms = null;

        $scope.leftSelected = [];
        $scope.rightSelected = [];

        $scope.selectedSpecialties = [];
        $scope.nonSelectedSpecialties = [];

        $scope.selectedSymptom = null;

        $scope.editSymptom = function (symptom) {
            $scope.editing = true;

            if($scope.selectedSymptom) {
                $scope.rightSelected = $scope.selectedSymptom.specialties.map(function (a) {
                    return a.id;
                });

                $scope.moveSelectedToNon();
            }

            $scope.selectedSymptom = symptom;

            $scope.initSpecialties();

            window.scrollTo(0, 50);
        };

        $scope.removeSymptom = function (symptom, $event) {
            DialogService.deleteItem(symptom, symptom.name, $event)
                .then(function (success) {
                    $http({
                        url: "/symptoms/" + symptom.id + "/delete",
                        method: "DELETE"
                    })
                        .then(function (success) {
                            location.href = "/dashboard/symptoms";
                        }, angular.noop);
                }, angular.noop);
        };

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
            if($scope.selectedSymptom && $scope.allSpecialties) {
                $scope.leftSelected = $scope.selectedSymptom.specialties.map(function (a) {
                    return a.id;
                });

                $scope.moveNonToSelected();
            }
        };

        $scope.$watch('selectedSymptom.name', function (newVal) {
            var alphaNumeric = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ";

            if($scope.selectedSymptom.name) {
                var newString = "";

                for (var i = 0; i < $scope.selectedSymptom.name.length; i++) {
                    if(alphaNumeric.indexOf($scope.selectedSymptom.name.charAt(i)) > -1) {
                        newString += $scope.selectedSymptom.name.charAt(i);
                    }
                }

                $scope.selectedSymptom.name = newString.trim();
            }
        });

        SymptomService.all()
            .then(function (success) {
                $scope.allSymptoms = success.data;
            }, angular.noop);

        SpecialtyService.all()
            .then(function (success) {
                $scope.nonSelectedSpecialties = success.data.slice();
                $scope.allSpecialties = success.data.slice();
                $scope.selectedSpecialties = [];

                $scope.initSpecialties();
            }, angular.noop);

        //Are we at the edit path
        var pathSegments = window.location.pathname.split("/");

        if(pathSegments[pathSegments.length - 1] === "edit") {

            $scope.edit = true;

            var id = pathSegments[pathSegments.length - 2];

            $http({
                url: "/symptoms/" + id,
                method: "GET"
            })
                .then(function (success) {
                    $scope.selectedSymptom = success.data;

                    $scope.initSpecialties();
                }, angular.noop);
        }

    });