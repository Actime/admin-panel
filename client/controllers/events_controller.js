application
    .factory( 'EventRepository', [ '$http', '$cookies', 'AuthRepository', function( $http, $cookies, AuthRepository ){
        return{
            // Gets all the events from the api
            getAll : function(){
                return $http( {
                    method : 'GET',
                    headers : {
                        'Content-Type' : 'application/json',
                        'Authorization' : AuthRepository.getTheFullAuthHeader()
                    },
                    url : AuthRepository.getApiUri() + 'event/'
                });
            },
            getById : function(id){
                return $http({
                    method : 'GET',
                    headers : {
                        'Content-Type' : 'application/json',
                        'Authorization' : AuthRepository.getTheFullAuthHeader()
                    },
                    url : AuthRepository.getApiUri() + 'event/' + id
                });
            },
            getCompetitions : function(id){
                return $http({
                    method : 'GET',
                    headers : {
                        'Content-Type' : 'application/json',
                        'Authorization' : AuthRepository.getTheFullAuthHeader()
                    },
                    url : AuthRepository.getApiUri() + 'competition/byevent/?event_id=' + id
                });
            },
            newEvent : function( data ) {
                var jsonData = JSON.stringify({
                    name : data.name,
                    description : data.description,
                    event_type : data.event_type,
                    date_start : data.date_start,
                    date_finish : data.date_finish,
                    date_limit : data.date_limit,
                    ubication : data.ubication,
                    address : data.address,
                    orginizer : data.orginizer,
                    image_url : '',
                    competitors_limit : data.competitors_limit,
                    user : AuthRepository.getSession().id
                });
                console.log( jsonData );
                return $http({
                    method : 'POST',
                    headers : {
                        'Content-Type' : 'application/json',
                        'Authorization' : AuthRepository.getTheFullAuthHeader()
                    },
                    url : AuthRepository.getApiUri() + 'event/',
                    data : jsonData
                });
            },
            updateEvent : function( data ) {
                var jsonData = JSON.stringify({
                    name : data.name,
                    description : data.description,
                    event_type : data.event_type,
                    date_start : data.date_start,
                    date_finish : data.date_finish,
                    date_limit : data.date_limit,
                    ubication : data.ubication,
                    address : data.address,
                    orginizer : data.orginizer,
                    image_url : data.image_url,
                    competitors_limit : data.competitors_limit,
                    user : data.user
                });
                console.log( jsonData );
                return $http({
                    method : 'PUT',
                    headers : {
                        'Content-Type' : 'application/json',
                        'Authorization' : AuthRepository.getTheFullAuthHeader()
                    },
                    url : AuthRepository.getApiUri() + 'event/' + data.id,
                    data : jsonData
                });
            },
            deleteEvent : function( id ) {
                return $http({
                    method : 'DELETE',
                    headers : {
                        'Content-Type' : 'application/json',
                        'Authorization' : AuthRepository.getTheFullAuthHeader()
                    },
                    url : AuthRepository.getApiUri() + 'event/' + id
                });
            },
            imageToEvent : function( id, file ) {
                var jsonData = JSON.stringify( { file } );
                console.log( jsonData );
                return $http({
                    method : 'PUT',
                    headers : {
                        'Content-Type' : 'application/json',
                        'Authorization' : AuthRepository.getTheFullAuthHeader()
                    },
                    url : AuthRepository.getApiUri() + 'event/image/' + id,
                    data : jsonData
                });
            }
        }
    }])// End of event service
    .controller( 'EventController', [ '$scope', '$rootScope', '$routeParams', '$location', '$mdDialog', 'EventRepository', function( $scope, $rootScope, $routeParams, $location, $mdDialog, EventRepository ){
        // load all the events funciton
        var load_events = function() {
            // Get all the events from the api yea!!!
            EventRepository.getAll().success(function(data){
                $scope.events = data['data'];
            }).error(function(error){
                // here a notification of something went wrong
            });// End of get all the events
        };
        // Get the event by id
        if($routeParams.id)
        {
            // Get event by id service
            EventRepository.getById( $routeParams.id ).success( function(data){
                $scope.event_detail = data['data'];
            }).error(function(error){
                // Error notification i guess
                $.notify( "There was an error getting this event.", "error" );
            });// End of get event detail by id
            EventRepository.getCompetitions( $routeParams.id ).success(function(data){
                $scope.competitions = data['data'];
            }).error(function(error){
                // Error notification i guess
                $.notify( "There was an error getting the Competitions for this event.", "error" );
            });
            // Show delete confirmation dialog
            $scope.showDeleteConfirm = function( ev ){
                // Appending dialog to document.body to cover sidenav in docs app
                var confirm = $mdDialog.confirm()
                    .title('Would you like to delete the Event?')
                    .textContent("After you delete this, It won't be possible to get it back.")
                    .ariaLabel('Lucky day')
                    .targetEvent(ev)
                    .ok('Delete Event')
                    .cancel('Cancel');
                // confirmation dialog
                $mdDialog.show(confirm).then(function() {
                    EventRepository.deleteEvent( $routeParams.id ).success( function(data) {
                        $.notify( "Your Event has been deleted.", "warn" );
                        $location.path( '/events/' );
                    }).error( function(error) {
                        $.notify( "Something went wrong.", "error" );
                    });
                }, function() {
                    // Nofity the error or cancelation
                });
            };
        } else if( $location.path() === '/events/' ){
            // load all the events
            load_events();
        } else if( $location.path() === '/events/new/' ){
            // init the event model variable
            $scope.event_obj = { name : '', description : '', date_start : '', date_finish : '', date_limit : '', competitors_limit : '', ubication : '', orginizer : '', address : '', event_type : 1 };
            // new event function
            $scope.newEvent = function(){
                // Get the dates from the inputs, cause the peace of shit angular injector does shit :@
                $scope.event_obj.date_start =  document.getElementById('date_start_hidden').value;
                $scope.event_obj.date_finish = document.getElementById('date_finish_hidden').value;
                $scope.event_obj.date_limit = document.getElementById('date_limit_hidden').value;
                // Add the event
                EventRepository.newEvent( $scope.event_obj ).success( function(data) {
                    $.notify( "The Event '" + $scope.event_obj.name + "', has been successfuly added." , "success" );
                    // Add image
                    EventRepository.imageToEvent( data.id, $scope.event_image ).success( function( data ) {
                        console.log( data );
                    }).error( function( error ) {
                        console.log( error );
                        $.notify( "There was an error with the image.", "error" );
                    });
                    $location.path( '/events/' );
                }).error( function(error) {
                    $.notify( "There was an error adding the Event", "error" );
                });
            };
        }
    }]);// End of event controller
