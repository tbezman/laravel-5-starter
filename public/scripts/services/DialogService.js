angular.module('app')
    .factory("DialogService", function ($mdDialog) {
        var DialogService = {};

        DialogService.deleteItem = function (item, text, $event) {
            return $mdDialog.show({
                templateUrl: "/views/dialogs/deleteItemDialogView.html",

                controller: function ($scope, item, text, $mdDialog) {
                    $scope.item = item;
                    $scope.text = text;
                    $scope.$mdDialog = $mdDialog;

                    console.log(item);
                },

                locals: {
                    item: item,
                    text: text
                },

                targetEvent: $event,

                clickOutsideToClose: true
            });
        };

        DialogService.approveChanges = function (surgeon, $event) {
            console.log(surgeon);
            return $mdDialog.show({
                templateUrl: "/views/dialogs/approveChangesDialogView.html",

                controller: function ($scope, $mdDialog, surgeon) {
                    $scope.$mdDialog = $mdDialog;
                    $scope.surgeon = surgeon;

                    $scope.shouldRenderFieldForSurgeon = function (key, surgeon) {
                        if(typeof surgeon[key] !== "object" && typeof surgeon[key] !== "array") {
                            if(surgeon[key] !== surgeon.current_edit[key] && $scope.isSafe(key)) {
                                if(!surgeon[key]) surgeon[key] = "Empty";
                                if(surgeon[key] && surgeon.current_edit[key]) return true;
                            }
                        }

                        return false;
                    };

                    $scope.isSafe = function (key) {
                        var unsafe = ['id', 'created_at', 'updated_at', 'changed_from', 'edit', 'approved', 'primary_specialty'];

                        return unsafe.indexOf(key) < 0;
                    };

                    $scope.isLink = function (text) {
                        return text.indexOf('/') > -1;
                    };

                    $scope.formatKey = function (key) {
                        return key.replace(/_/g, ' ');
                    };

                    $scope.approve = function () {
                        location.href = "/surgeon/" + surgeon.current_edit.id + "/approve";
                    };
                },

                locals: {
                    surgeon: surgeon
                },

                targetEvent: $event,

                clickOutsideToClose: true
            });
        };

        DialogService.showViewReportDialog = function (surgeon, VendorService) {
            return $mdDialog.show({
                templateUrl: "/views/dialogs/timerDialogView.html",

                controller: function ($scope, surgeon, $interval, $mdDialog, VendorService) {

                    $scope.$mdDialog = $mdDialog;

                    $scope.timer = 30;

                    $scope.done = function () {
                        if ($scope.timer < 1) {
                            $mdDialog.hide();
                        }
                    };

                    $scope.getAllPremium = function () {
                        VendorService.allPremium()
                            .then(function (success) {
                                $scope.premiums = success.data;

                                $scope.currentVendor = $scope.premiums[Math.floor(Math.random() * $scope.premiums.length)];

                                console.log($scope.currentVendor);
                            }, angular.noop);
                    };

                    $interval(function () {
                        $scope.timer--;
                    }, 1000);

                    $interval(function () {
                        $scope.currentVendor = $scope.premiums[Math.floor(Math.random() * $scope.premiums.length)];
                    }, 10000);

                },

                locals: {
                    surgeon: surgeon
                }
            })
        };

        DialogService.reviewItemDialog = function (item, type, edit) {
            return $mdDialog.show({
                templateUrl: "/views/dialogs/approveItemDialogView.html",

                locals: {
                    item: item,
                    type: type
                },

                controller: function ($scope, item, type, $mdDialog) {
                    $scope.item = item;
                    $scope.type = type;
                    $scope.$mdDialog = $mdDialog;

                    console.log(item);

                    $scope.shouldRenderFieldForItem = function (key, surgeon) {
                        if(typeof surgeon[key] !== "object" && typeof surgeon[key] !== "array") {
                            if(surgeon[key] && $scope.isSafe(key)) {
                                if(surgeon[key]) return true;
                            }
                        }

                        return false;
                    };

                    $scope.isSafe = function (key) {
                        var unsafe = ['id', 'created_at', 'updated_at', 'changed_from', 'edit', 'approved', 'primary_specialty', 'owner', 'lat', 'lng', 'owner_id'];

                        return unsafe.indexOf(key) < 0;
                    };

                    $scope.isLink = function (text) {
                        return text.indexOf('/') > -1;
                    };

                    $scope.formatKey = function (key) {
                        return key.replace(/_/g, ' ');
                    };

                    $scope.approve = function () {

                        if($scope.status) {
                           $mdDialog.hide($scope.reason);
                        }

                        $scope.status = 'approve';
                    };

                    $scope.deny = function () {

                        if($scope.status) {
                            $mdDialog.cancel($scope.reason);
                        }

                        $scope.status = 'deny';
                    }
                }
            })
        };

        DialogService.showCropImageView = function (image) {
            return $mdDialog.show({
                templateUrl: "/views/dialogs/imageCropDialogView.html",

                controller: function ($scope, image, $mdDialog) {
                    $scope.myImage = image;
                    $scope.croppedImage = '';

                    $scope.$mdDialog = $mdDialog;
                },

                locals: {
                    image: image
                }
            })
        };

        DialogService.showCreateArticleDialog = function () {
            return $mdDialog.show({
                templateUrl: "/views/dialogs/createArticleDialogView.html",

                controller : function ($scope, $mdDialog) {
                    $scope.$mdDialog = $mdDialog;
                }
            })
        };

        DialogService.getConfirmation = function (message, $event) {
            return $mdDialog.show({
                templateUrl: "/views/dialogs/confirmationDialogView.html",
                event: $event,

                controller: function ($scope, $mdDialog) {
                    $scope.$mdDialog = $mdDialog;
                }
            });
        };

        return DialogService;
    });