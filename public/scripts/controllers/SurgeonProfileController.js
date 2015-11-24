function SurgeonProfileController($sce, YoutubeService) {
    var self = this;

    self.setSurgeon = function (surgeon) {
        self.surgeon = surgeon;
        console.log(surgeon);

        self.setYoutubeTime();
    };

    self.trustUrl = function (url) {
        return $sce.trustAsResourceUrl(url);
    };

    self.formattedName = function () {
        var surgeon = self.surgeon;
        return [surgeon.prefix, surgeon.first_name, surgeon.last_name, surgeon.suffix].join(' ');
    };

    self.setYoutubeTime = function () {
        var id = YoutubeService.idFromUrl(self.surgeon.youtube_url);

        self.surgeon.safe_youtube_url = 'https://www.youtube.com/embed/' + id;

        YoutubeService.timeDurationOfYoutubeId(id)
            .then(function (time) {
                self.youtubeTime = time;
            }, angular.noop);
    };

    self.formatSchoolTime = function (school) {
        var start = school.started;
        var end = school.present ? "Present" : school.ended;

        return start + " - " + end;
    };

   return self;
}

angular.module('app')
    .controller('SurgeonProfileController', SurgeonProfileController);