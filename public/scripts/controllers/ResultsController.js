angular.module('app')
    .controller("ResultsController", function ($scope, $http, SpecialtyService, SymptomService) {

        $scope.results = [];
        $scope.allSpecialties = [];
        $scope.allSymptoms = [];

        $scope.setResults = function (results, query, zip, page, radius, count) {
            $scope.results = results;
            $scope.query = query;
            $scope.county = $scope.routeParams.county ? $scope.routeParams.county.replace('+', ' ') : '';
            $scope.page = page ? page : 1;
            $scope.radius = radius ? radius.toString() : (25).toString();
            $scope.count = count ? count : 0;

            $scope.$watch('radius', function (oldVal, newVal) {
                if(oldVal !== newVal && $scope.county) {
                    window.location = ("/surgeon/search?query=" + encodeURIComponent($scope.query.replace(/ /g, '+')) + "&county=" + $scope.county + "&radius=" + $scope.radius);
                }
            });
        };

        $scope.shouldSearch = true;

        $scope.searchResults = {
            specialties: [],
            symptoms: []
        };

        $scope.query = "";

        $scope.$watch('query', function (newVal, oldVal) {

            $scope.searchResults = {
                specialties: [],
                symptoms: []
            };

            if(newVal !== oldVal && $scope.query && $scope.query.length > 1 && $scope.shouldSearch) {

                var query = $scope.query.toLowerCase();

                $scope.allSpecialties.forEach(function (a) {
                    var name = a.special.toLowerCase();

                    if(name.indexOf(query) > -1 || query.indexOf(name) > -1) {
                        var alreadyHas = false;

                        $scope.searchResults.specialties.forEach(function (specialty) {
                            if(specialty.id == a.id) alreadyHas = true;
                        });

                        if(!alreadyHas) $scope.searchResults.specialties.push(a);
                    }
                });

                $scope.allSymptoms.forEach(function (a) {
                    var name = a.name.toLowerCase();

                    if(name.indexOf(query) > -1 || query.indexOf(name) > -1) {
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

            $scope.query = term;
        };

        $scope.shouldList = function () {
            return $scope.searchResults.specialties.length > 0 || $scope.searchResults.symptoms.length > 0;
        }

        $scope.specialtyMatchesSearch = function (specialty, query, result) {

            var words = query.split(" ");

            for(var i = 0; i < words.length; i++) {
                var word = words[i];

                if (specialty.special.toLowerCase().indexOf(word.toLowerCase()) > -1) return true;
            }

            return false;
        };

        $scope.getMatchingSpecialtyForSurgeon = function (surgeon) {

            var matchingSpecialties = [];

            for(var i = 0, found = 0; i < surgeon.specialties.length; i++) {
                var specialty = surgeon.specialties[i];

                if($scope.specialtyMatchesSearch(specialty, $scope.query, surgeon)) {
                    return specialty;
                }
            }
        };

        $scope.moreInfo = function (result) {
            window.location = '/surgeon/' + result.id + '/url';
        };

        $scope.makeAppointment = function (result) {
            window.location = '/surgeon/' + result.id + '/appointment';
        };

        $scope.getRange = function (start, finish) {
            var returnArray = [];

            for(var i = start; i <= finish; i++)
                returnArray.push(i);

            return returnArray;
        };

        $scope.setPage = function (i) {
            if(i !== $scope.page) {
                window.location = ("/surgeon/search?query=" + encodeURIComponent($scope.query.replace(/ /g, '+')) + "&page=" + i + "&county=" + $scope.county + "&radius=" + $scope.radius);
            }
        };

        $scope.getMaxPage = function () {
            return Math.ceil($scope.count / 21.0);
        };

        $scope.shouldRenderPageNumber = function(i) {
            return i > 0 && i <= Math.ceil($scope.count / 21.0);
        };

        $scope.shouldShowSurgeon = function (surgeon) {
            return !!surgeon.image;
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

        $scope.routeParams = $scope.getQueryParams();

        $http({
            url: "/surgeon/search.json",
            method: "POST",
            data: $scope.routeParams
        })
            .then(function (success) {
                var res = success.data;

                $scope.setResults(res.surgeons, ($scope.routeParams.query ? $scope.routeParams.query.replace(/\+/g, ' ') : ''), $scope.routeParams.zip, $scope.routeParams.page, $scope.routeParams.radius, res.count);
            }, function (error) {

            });

        $scope.updateCategoryFromQuery = function () {
            for(var specialtyKey in $scope.allSpecialties) {
                var specialty = $scope.allSpecialties[specialtyKey];

                if(specialty.special === $scope.query) $scope.selectedCategory = specialty;
            }
        };

        SpecialtyService.all()
            .then(function (success) {
                $scope.allSpecialties = success.data;
            }, angular.noop);

        SymptomService.all()
            .then(function (success) {
                $scope.allSymptoms = success.data;
            }, angular.noop);
    });