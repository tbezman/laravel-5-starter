angular.module("app", [
        'ngMaterial',
        'ngImgCrop',
        'ngSanitize',
        'textAngular'
    ])
    .filter("reverse", function () {
        return function (data) {
            return data.reverse();
        }
    })

    .filter('lDate', function ($filter) {
        return function (data, params) {
            return $filter('date')(new Date(data), params);
        }
    })
    .directive('outsideClick', function ($document) {
        return {
            restrict: 'A',
            link: function (scope, elem, attr, ctrl) {
                elem.bind('click', function (e) {
                    e.stopPropagation();
                });
                $document.bind('click', function () {
                    scope.$apply(attr.outsideClick);
                })
            }
        }
    })
    .filter('tel', function () {
        return function (tel) {
            if (!tel) { return ''; }

            var value = tel.toString().trim().replace(/^\+/, '');

            if (value.match(/[^0-9]/)) {
                return tel;
            }

            var country, city, number;

            switch (value.length) {
                case 10: // +1PPP####### -> C (PPP) ###-####
                    country = 1;
                    city = value.slice(0, 3);
                    number = value.slice(3);
                    break;

                case 11: // +CPPP####### -> CCC (PP) ###-####
                    country = value[0];
                    city = value.slice(1, 4);
                    number = value.slice(4);
                    break;

                case 12: // +CCCPP####### -> CCC (PP) ###-####
                    country = value.slice(0, 3);
                    city = value.slice(3, 5);
                    number = value.slice(5);
                    break;

                default:
                    return tel;
            }

            if (country == 1) {
                country = "";
            }

            number = number.slice(0, 3) + '-' + number.slice(3);

            return (country + " (" + city + ") " + number).trim();
        };
    });
