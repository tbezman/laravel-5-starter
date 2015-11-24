angular.module('app')
    .controller('NavController', NavController);

function NavController(ActivityService) {

    var self = this;

    this.requests = [];
    this.applications = [];

    this.notificationCount = function () {
        var sum = 0;

        if (self.requests) {
            _.values(self.requests).forEach(function (requestType) {
                sum += requestType.length;
            })
        }

        if (self.applications) {
            _.values(self.applications).forEach(function (applicationType) {
                sum += applicationType.length;
            })
        }

        return sum;
    };

    this.openLink = function (link) {
        console.log("FUCKNG LINK M*");
        location.href = link;
    };

    ActivityService.getRequests()
        .then(function (success) {
            self.reqeusts = success.data;
        }, angular.noop);

    ActivityService.getApplications()
        .then(function (success) {
            self.applications = success.data;
        }, angular.noop);
}