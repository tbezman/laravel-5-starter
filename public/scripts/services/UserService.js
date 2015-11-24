angular.module('app')
    .factory('UserService', function (DialogService) {
        var UserService = {};

        UserService.changePasswordForUser = function (user) {
            return $http({
                method: "POST",
                url: "/auth/" + user.id + "/changeuserpass"
            })
        };

        UserService.changePasswordForUserWithDialog = function (user, $event) {
            DialogService.getConfirmation("Some random message", $event)
                .then(function (success) {

                }, angular.noop);
        };

        return UserService;
    });