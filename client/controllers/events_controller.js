application
    .factory( 'EventRepository', [ '$http', '$cookies', 'AuthRepository', function( $http, $cookies, AuthRepository ){
        return{
            // Gets all the events from the api
            getAll : function(){
                return $http( {
                    method : 'GET',
                    url : AuthRepository.getApiUri() + 'event/'
                });
            },
            getById : function(id){
                return $http({
                    method : 'GET',
                    url : AuthRepository.getApiUri() + 'event/' + id
                });
            },
            getCompetitions : function(id){
                return $http({
                    method : 'GET',
                    url : AuthRepository.getApiUri() + 'competition/byevent?event_id=' + id
                });
            }
        }
    }])// End of event service
    .controller( 'EventController', [ '$scope', '$rootScope', '$routeParams', 'EventRepository', function( $scope, $rootScope, $routeParams, EventRepository ){
        // Get all the events from the api yea!!!
        EventRepository.getAll().success(function(data){
            $scope.events = data['data'];
        }).error(function(error){
            // here a notification of something went wrong
        });// End of get all the events
        $scope.search = { text : "" };
        // Get the event by id
        if($routeParams.id)
        {
            // Get event by id service
            EventRepository.getById( $routeParams.id ).success( function(data){
                $scope.event_detail = data['data'];
            }).error(function(error){
                // Error notification i guess
            });// End of get event detail by id
            EventRepository.getCompetitions( $routeParams.id ).success(function(data){
                $scope.competitions = data['data'];
            }).error(function(error){
                // Error notification i guess
            });
        }
    }]);// End of event controller
