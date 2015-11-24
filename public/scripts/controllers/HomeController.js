angular.module('app')
    .controller("HomeController", function ($scope, SpecialtyService, SymptomService, $http) {

        $scope.allSpecialties = [];
        $scope.allSymptoms = [];

        $scope.shouldSearch = true;

        $scope.searchResults = {
            specialties: [],
            symptoms: []
        };

        $scope.searchTerm = "";

        $scope.$watch('searchTerm', function (newVal, oldVal) {

            $scope.searchResults = {
                specialties: [],
                symptoms: []
            };

            if(newVal !== oldVal && $scope.searchTerm && $scope.searchTerm.length > 1 && $scope.shouldSearch) {

                var searchTerm = $scope.searchTerm.toLowerCase();

                $scope.allSpecialties.forEach(function (a) {
                    var name = a.special.toLowerCase();

                    if(name.indexOf(searchTerm) > -1 || searchTerm.indexOf(name) > -1) {
                        var alreadyHas = false;

                        $scope.searchResults.specialties.forEach(function (specialty) {
                            if(specialty.id == a.id) alreadyHas = true;
                        });

                        if(!alreadyHas) $scope.searchResults.specialties.push(a);
                    }
                });

                $scope.allSymptoms.forEach(function (a) {
                    var name = a.name.toLowerCase();

                    if(name.indexOf(searchTerm) > -1 || searchTerm.indexOf(name) > -1) {
                        var alreadyHas = false;

                        $scope.searchResults.symptoms.forEach(function (symptom) {
                            if(symptom.id == a.id) alreadyHas = true;
                        });

                        if(!alreadyHas) $scope.searchResults.symptoms.push(a);
                    }
                });
            }

            if(!$scope.shouldSearch) $scope.shouldSearch = true;
        });

        $scope.setSearchTerm = function (term) {
            $scope.shouldSearch = false;

            $scope.searchTerm = term;
        };

        $scope.shouldList = function () {
            return $scope.searchResults.specialties.length > 0 || $scope.searchResults.symptoms.length > 0;
        };

        SpecialtyService.all()
            .then(function (success) {
                $scope.allSpecialties = success.data;
            }, angular.noop);

        SymptomService.all()
            .then(function (success) {
                $scope.allSymptoms = success.data;
            }, angular.noop);

        $http({
            url: "/county/closest",
            method: "GET"
        })
            .then(function (success) {
                $scope.county = success.data.county + ", " + success.data.state;
                console.log($scope.county);
            }, function (error) {
                console.log(error);
            })
    });