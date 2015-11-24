angular.module('app')
    .directive("imagecrop", function () {
        return {
            restrict: "A",

            scope: {
                'imagecrop' : '='
            },

            link: function ($scope, $element) {
                $scope.formData = new FormData($element.context.form);

                $scope.dataURItoBlob = function(dataURI) {
                    var binary = atob(dataURI.split(',')[1]);
                    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
                    var array = [];
                    for(var i = 0; i < binary.length; i++) {
                        array.push(binary.charCodeAt(i));
                    }

                    return new Blob([new Uint8Array(array)], {type: mimeString});
                };
            },

            controller: function ($scope, DialogService, $element) {
                $element.bind("change", function ($event) {
                    var reader = new FileReader();

                    reader.onload = function (readevent) {
                        $scope.$apply(function ($scope) {
                            var image = readevent.target.result;

                            DialogService.showCropImageView(image)
                                .then(function (success) {

                                    var input = document.createElement('input');
                                    input.setAttribute('name', $element.attr('imagecrop'));
                                    input.setAttribute('type', 'hidden');
                                    input.setAttribute('value', success);

                                    $element.context.form.appendChild(input);

                                }, angular.noop);
                        })
                    };

                    reader.readAsDataURL($event.target.files[0]);
                });
            }
        }
    });