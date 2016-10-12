application
    .factory( 'MediaRepository', [ '$http', 'AuthRepository', function( $http, AuthRepository ) {
        return({
            eventPrizes : function( event_id ) {
                return $http({
                    method : 'GET',
                    headers : AuthRepository.getFullJSONHeader(),
                    url : AuthRepository.getApiUri() + 'prize/?event_id=' + event_id
                });
            },
            addPrize : function( data ) {
                var jsonData = JSON.stringify( data );
                return $http({
                    method : 'POST',
                    headers : AuthRepository.getFullJSONHeader(),
                    url : AuthRepository.getApiUri() + 'prize/',
                    data : jsonData
                });
            },
            updatePrize : function( data ) {
                var jsonData = JSON.stringify({
                    name : data.name,
                    description : data.description,
                    image_url : data.image_url,
                    event : data.event
                });
                return $http({
                    method : 'PUT',
                    headers : AuthRepository.getFullJSONHeader(),
                    url : AuthRepository.getApiUri() + 'prize/' + data.id,
                    data : jsonData
                });
            },
            deletePrize : function( id ) {
                return $http({
                    method : 'DELETE',
                    headers : AuthRepository.getFullJSONHeader(),
                    url : AuthRepository.getApiUri() + 'prize/' + id
                });
            },
            imageToPrize : function( file, id ) {
                var jsonData =  JSON.stringify( file );
                return $http({
                    method : 'PUT',
                    headers : AuthRepository.getFullJSONHeader(),
                    url : AuthRepository.getApiUri() + 'prize/image/' + id,
                    data : jsonData
                });
            },
            eventGallery : function( event_id ) {
                return $http({
                    method : 'GET',
                    headers : AuthRepository.getFullJSONHeader(),
                    url : AuthRepository.getApiUri() + 'gallery/?event_id=' + event_id
                });
            },
            deleteImageFromGallery : function( id ) {
                return $http({
                    method : 'DELETE',
                    headers : AuthRepository.getFullJSONHeader(),
                    url : AuthRepository.getApiUri() + 'gallery/' + id
                });
            },
            addImageToGallery : function( file, id ) {
                var jsonData = JSON.stringify( file );
                return $http({
                    method : 'POST',
                    headers : AuthRepository.getFullJSONHeader(),
                    url : AuthRepository.getApiUri() + 'event/gallery/' + id,
                    data : jsonData
                });
            }
        });
    }])
    .controller( 'MediaController', [ '$scope', '$routeParams', '$mdDialog', '$location', 'MediaRepository', function( $scope, $routeParams, $mdDialog, $location, MediaRepository ) {
        if ( $location.path().includes( '/events/prizes/' ) ) {
            var init_prize = function() {
                $scope.prize = { name : '', description : '', image_url : '', event : $routeParams.id };
            };
            var load_prizes = function() {
                MediaRepository.eventPrizes( $routeParams.id ).success( function( data ) {
                    $scope.prizes = data['data'];
                }).error( function( error ) {
                    $.notify( "There was an error getting the prizes from the system.", "error" );
                });
            };
            load_prizes();
            init_prize();
            $scope.deleteConfrimation = function( ev, id ) {
                // Appending dialog to document.body to cover sidenav in docs app
                var confirm = $mdDialog.confirm()
                    .title('Would you like to delete the Prize?')
                    .textContent("After you delete this, It won't be possible to get it back.")
                    .ariaLabel('Lucky day')
                    .targetEvent(ev)
                    .ok('Delete Prize')
                    .cancel('Cancel');
                // confirmation dialog
                $mdDialog.show(confirm).then(function() {
                    // Delete stuff
                    MediaRepository.deletePrize( id ).success( function( data ) {
                        $.notify( "Deleting the prize successfuly.", "success" );
                        load_prizes();
                    }).error( function( error ) {
                        $.notify( "There was a problem deleting the prize from the system.", "error" );
                    });
                }, function() {
                    // Nofity the error or cancelation
                });
            };
            $scope.onLoad = function (e, reader, file, fileList, fileOjects, fileObj) {
                $scope.prize_image = fileObj.base64;
            };
            $scope.newPrize = function() {

                MediaRepository.addPrize( $scope.prize ).success( function( data ) {
                    $.notify( "Prize successfuly added to the system.", "success" );
                    MediaRepository.imageToPrize( $scope.prize_image, data.id ).success( function( data ) {
                        $.notify( "Image successfuly uploaded to prize.", "success" );
                        load_prizes();
                        init_prize();
                    }).error( function( error ) {
                        $.notify( "there was an error adding the image to the prize.", "error" );
                    });
                }).error( function( error ) {
                    $.notify( "There was a problem adding the prize on the system.", "error" );
                });
            };
        } else if( $location.path().includes( "/events/gallery/" ) ) {
            $scope.onLoad = function (e, reader, file, fileList, fileOjects, fileObj) {
                $scope.image = fileObj.base64;
            };
            $scope.addImage = function() {
                MediaRepository.addImageToGallery( $scope.image, $routeParams.id ).success( function( data ) {
                    $.notify( "Image successfuly added to the gallery.", "success" );
                    load_gallery();
                }).error( function( error ) {
                    console.log( error );
                    $.notify( "There was an error adding the image to the gallery.", "error" );
                });
            };
            $scope.deleteConfirmation = function( ev, id ) {
                // Appending dialog to document.body to cover sidenav in docs app
                var confirm = $mdDialog.confirm()
                    .title('Would you like to delete the Image?')
                    .textContent("After you delete this, It won't be possible to get it back.")
                    .ariaLabel('Lucky day')
                    .targetEvent(ev)
                    .ok('Delete Image')
                    .cancel('Cancel');
                // confirmation dialog
                $mdDialog.show(confirm).then(function() {
                    // Delete stuff
                    MediaRepository.deleteImageFromGallery( id ).success( function( data ) {
                        $.notify( "The image was successfuly deleted.", "success" );
                        load_gallery();
                    }).error( function( error ) {
                        $.notify( "There was an error deleting the image form the system.", "error" );
                    });
                }, function() {
                    // Nofity the error or cancelation
                });
            };
            var load_gallery = function() {
                MediaRepository.eventGallery( $routeParams.id ).success( function( data ) {
                    $scope.galleries = data['data'];
                }).error( function( error ) {
                    $.notify( "There was an error getting data from the system.", "error" );
                });
            };
            load_gallery();

        }
    }]);
