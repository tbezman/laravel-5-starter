angular.module('app')
    .controller("DashboardController", function ($scope, $http, DialogService, $timeout, $location) {

        $scope.getRange = function (start, finish) {
            //Get array from range
            var returnArray = [];

            for(var i = start; i <= finish; i++)
                returnArray.push(i);

            return returnArray;
        };

        $scope.setPage = function (i, force) {
            //Don't set it to same page unless force is specified
            if(i !== $scope.page || force) {
                window.location = ("/dashboard/search?query=" + $scope.query + "&page=" + i + "&default=" + $scope.selectedSearchCategory + "&limit=" + $scope.maxResults);
            }
        };

        $scope.getSelectedCount = function () {
            return $scope[$scope.selectedSearchCategory + "Count"];
        };

        $scope.getCountForSelected = function () {
            //Migrated for user experience
            return $scope.getSelectedCount();
        };

        $scope.getMaxPage = function () {
            //Number of results returned / max results is raised is absolute page count
            return Math.ceil($scope.getCountForSelected() / $scope.maxResults);
        };

        $scope.shouldRenderPageNumber = function(i) {
            //Is the page between 1 and the maximum page for category
            return i > 0 && i <= $scope.getMaxPage();
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

        $scope.getResultsCount = function () {
            //Either show the absolute amount of results of limited array or show max results
            if($scope.selectedSearchCategory === "all") {
                return Math.min($scope.allLength, $scope.maxResults);
            }

            return Math.min($scope[$scope.selectedSearchCategory + "Results"].length, $scope.maxResults);
        };

        $scope.editSurgeon = function (surgeon) {
            window.location.href = "/surgeon/" + surgeon.id + "/edit";
        };

        $scope.deleteSurgeon = function (surgeon, $event) {
            DialogService.deleteItem(surgeon, surgeon.first_name + " " + surgeon.last_name, $event)
                .then(function (success) {
                    window.location.href = "/surgeon/" + surgeon.id + "/delete";
                }, angular.noop);
        };

        $scope.editASC = function (ASC) {
            window.location.href = "/asc/" + ASC.id + "/edit";
        };

        $scope.deleteASC = function (ASC, $event) {
            DialogService.deleteItem(ASC, ASC.name, $event)
                .then(function (success) {
                    window.location.href = "/asc/" + ASC.id + "/delete";
                }, angular.noop);
        };

        $scope.editVendor = function (vendor) {
            window.location.href = "/vendor/" + vendor.id + "/edit";
        };

        $scope.deleteVendor = function (vendor, $event) {
            DialogService.deleteItem(vendor, vendor.name, $event)
                .then(function (success) {
                    window.location.href = "/vendor/" + vendor.id + "/delete";
                }, angular.noop);
        };

        $scope.setSelectedCategory = function(category) {
            $scope.selectedSearchCategory = category;

            //Get amount of max results of query for selected category
            var categoryCount = $scope[category + "Count"];

            //Set the page either to the query param if the page * maxResults exceeds the category count ELSE set it to maxPage for category
            $scope.page = categoryCount > ($scope.maxResults * $scope.page) ? $scope.getQueryParams().page : $scope.getMaxPage();
        };

        $scope.approveChanges = function (surgeon, $event) {
            console.log(surgeon);
            DialogService.approveChanges(surgeon, $event)
                .then(function (success) {
                    if (success === 'approve') {
                        window.location.href = "/surgeon/" + surgeon.current_edit.id + "/approve";
                    } else if (success === 'deny') {
                        window.location.href = "/surgeon/" + surgeon.current_edit.id + "/delete";
                    }
                }, angular.noop);
        };

        $scope.approveAnesthesiologistChanges = function (anesthesiologist, $event) {
            anesthesiologist.current_edit = anesthesiologist.edit;

            DialogService.approveChanges(anesthesiologist, $event)
                .then(function (success) {
                    if(success == "approve") {
                        window.location.href = "/anesthesiologist/" + anesthesiologist.edit.id + "/approve";
                    }

                    if(success === "deny") {
                        window.location.href = "/anesthesiologist/" + anesthesiologist.id + "/delete";
                    }
                }, angular.noop);
        }

        $scope.approveVendorChanges = function (vendor, $event) {
            DialogService.approveChanges(vendor, $event)
                .then(function (success) {
                    if (success === 'approve') {
                        window.location.href = "/vendor/" + vendor.current_edit.id + "/approve";
                    } else if (success === 'deny') {
                        window.location.href = "/vendor/" + vendor.current_edit.id + "/delete";
                    }
                }, angular.noop);
        };

        $scope.editAnesthesiologist = function (anesthesiologist, $event) {
            location.href = "/anesthesiologist/" + anesthesiologist.id + "/edit";
        };

        $scope.deleteAnesthesiologist = function (anesthesiologist, $event) {
            DialogService.deleteItem(anesthesiologist, anesthesiologist.first_name + " " + anesthesiologist.last_name, $event)
                .then(function (success) {
                    location.href = "/anesthesiologist/" + anesthesiologist.id + "/delete";
                }, angular.noop);
        };

        $scope.editEmployer = function (employer) {
            location.href = "/employer/" + employer.id + "/edit";
        };

        $scope.deleteEmployer = function (employer, $event) {
            DialogService.deleteItem(employer, employer.first_name + employer.last_name, $event)
                .then(function (success) {
                    location.href = "/employer/" + employer.id + "/delete";
                }, angular.noop);
        };

        $scope.getDisapproved = function () {
            $http({
                url: "/dashboard/disapproved",
                method: "GET"
            })
                .then(function (success) {
                    $scope.disapproved = success.data;
                }, angular.noop);
        };

        $http({
            url: "/dashboard/search.json",
            method: "POST",
            data: $scope.getQueryParams()
        })
            .then(function (success) {
                var res = success.data;
                var queryParams = $scope.getQueryParams();

                $scope.surgeonResults = res.surgeonResults;
                $scope.ascResults = res.ascResults;
                $scope.vendorResults = res.vendorResults;
                $scope.inactiveResults = res.inactiveResults;
                $scope.anesthesiologistResults = res.anesthesiologistResults;
                $scope.anesthesiologistCount = res.anesthesiologistCount;
                $scope.employerResults = res.employerResults;
                $scope.employerCount = res.employerCount;
                $scope.selectedSearchCategory = res.default;
                $scope.surgeonCount = res.surgeonCount;
                $scope.ascCount = res.ascCount;
                $scope.vendorCount = res.vendorCount;
                $scope.inactiveCount = res.inactiveCount;
                $scope.maxResults = queryParams.limit ? queryParams.limit * 1.0 : 10.0;
                
                $scope.allCount = res.anesthesiologistCount + res.employerCount + res.surgeonCount + res.ascCount + res.vendorCount + res.inactiveCount;
                $scope.allLength = res.anesthesiologistResults.length + res.employerResults.length + res.surgeonResults.length + res.ascResults.length + res.vendorResults.length + res.inactiveResults.length;

                $scope.query = queryParams.query ? queryParams.query : "";
                $scope.page = queryParams.page ? queryParams.page * 1 : 1;
            }, angular.noop);

        $http({
            url: "/dashboard/requests",
            method: "GET",
        })
            .then(function (success) {
                $scope.requests = success.data;
            }, angular.noop);
    });