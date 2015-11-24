angular.module('app')
    .factory("ArticleService", function (DialogService) {
        var ArticleService = {};

        ArticleService.createArticle = function () {
            DialogService.showCreateArticleDialog()
                .then(function (article) {
                    ArticleService.publishArticle(article)
                        .then(function (success) {

                        }, angular.noop);
                }, angular.noop);
        };

        ArticleService.publishArticle = function () {
            return $http({

            });
        };

        return ArticleService;
    });