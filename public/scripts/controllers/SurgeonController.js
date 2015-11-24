angular.module('app')
    .controller("SurgeonController", function ($scope, SpecialtyService, ASCService, $http, DialogService, $location, UserService) {

        $scope.UserService = UserService;

        $scope.leftSelected = [];
        $scope.rightSelected = [];

        $scope.selectedSpecialties = [];
        $scope.nonSelectedSpecialties = [];

        $scope.possibleYears =  (function() {
            var currentYear = new Date().getFullYear();
            var possibleYears = [];
            possibleYears.push('Present');
            for (var i = 0; i < 50; i++) {
                possibleYears.unshift(currentYear - i);
            }

            return possibleYears;
        })();

        console.log($scope.possibleYears);


        $scope.addNewAward = function (surgeon) {
            if (!surgeon.awards) {
                surgeon.awards = [];
            }

            surgeon.awards.push({});
        };

        $scope.addNewSchool = function (surgeon) {
            if (!surgeon.schools) {
                surgeon.schools = [];
            }

            surgeon.schools.push({});
        };

        $scope.addNewCertificate = function (surgeon) {
            if (!surgeon.certificates) {
                surgeon.certificates = [];
            }

            surgeon.certificates.push({});
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

        $scope.isSpecialtySelected = function (specialty) {
            var found = false;

            $scope.selectedSpecialties.forEach(function (a) {
                if(a.id == specialty.id) found = true;
            });

            return found;
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
            if($scope.surgeon && $scope.allSpecialties) {
                $scope.leftSelected = $scope.surgeon.specialties.map(function (a) {
                    return a.id;
                });

                $scope.moveNonToSelected();
            }
        };

        $scope.deleteSurgeon = function (surgeon, $event) {
            DialogService.deleteItem(surgeon, surgeon.first_name + " " + surgeon.last_name, $event)
                .then(function (success) {
                    window.location.href = "/surgeon/" + surgeon.id + "/delete";
                }, angular.noop);
        };

        $scope.getMine = function () {
            $http({
                url: "/surgeon/mine",
                method: "GET"
            })
                .then(function (success) {
                    $scope.surgeon = success.data;
                    $scope.originalSurgeon = $.extend(true, {}, $scope.surgeon);

                    $scope.initSpecialties();
                }, angular.noop);
        };

        $scope.setSurgeon = function (surgeon) {
            $scope.surgeon = surgeon;

            if(surgeon.awards.length == 0) $scope.addNewAward(surgeon);
            if(surgeon.schools == 0) $scope.addNewSchool(surgeon);
            if(surgeon.certificates == 0) $scope.addNewCertificate(surgeon);

            surgeon.schools.forEach(function (school) {
                if (school.present) school.ended = "Present";
            });

            console.log(surgeon);
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

        $scope.hasChanged = function (oldVal, newVal) {
            return angular.equals(oldVal, newVal);
        };

        SpecialtyService.all()
            .then(function (success) {
                $scope.nonSelectedSpecialties = success.data.slice();
                $scope.allSpecialties = success.data.slice();
                $scope.selectedSpecialties = [];

                $scope.initSpecialties();
            }, angular.noop);

        ASCService.all()
            .then(function (success) {
                $scope.allASC = success.data;
            }, angular.noop);


    });