angular.module('app')
    .factory('YoutubeService', function ($http, $q) {
        var YoutubeService = {};

        YoutubeService.idFromUrl = function (url) {
            return YoutubeService.getQueryParams(url).v;
        };

        YoutubeService.timeDurationOfYoutubeId = function (id) {
            var deferred = $q.defer();

            $http.get('https://www.googleapis.com/youtube/v3/videos?id=' + id + '&part=contentDetails&key=AIzaSyD1bUJ99AbUCz6V7Qi_1rYddSrjbj7De_E')
                .then(function (success) {
                    var duration = success.data.items[0].contentDetails.duration;

                    var totalSeconds = YoutubeService.totalSecondsFromYoutubeTime(duration);

                    var timeString = moment.duration(totalSeconds * 1000).humanize();

                    deferred.resolve(timeString);
                }, function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        };

        YoutubeService.totalSecondsFromYoutubeTime = function (input) {
            var reptms = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
            var hours = 0, minutes = 0, seconds = 0, totalseconds;

            if (reptms.test(input)) {
                var matches = reptms.exec(input);
                if (matches[1]) hours = Number(matches[1]);
                if (matches[2]) minutes = Number(matches[2]);
                if (matches[3]) seconds = Number(matches[3]);
                return hours * 3600  + minutes * 60 + seconds;
            }
        };

        YoutubeService.getQueryParams = function(url) {
            var pairs = url.split('?')[1].split('&');

            var result = {};
            pairs.forEach(function(pair) {
                pair = pair.split('=');
                result[pair[0]] = decodeURIComponent(pair[1] || '');
            });

            return JSON.parse(JSON.stringify(result));
        };


        return YoutubeService;
    });