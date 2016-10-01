application
    .factory( 'CompetitionsRepository', [ '$http', '$cookies', 'AuthRepository', function( $http, $cookies, AuthRepository ) {
        return {
                getById : function( id ) {
                    return $http({
                        method : 'GET',
                        url : AuthRepository.getApiUri() + 'competition/' + id
                    });
                },
                getRegisters : function( id ) {
                    return $http({
                        method : 'GET',
                        url : AuthRepository.getApiUri() + 'register/bycompetition/?competition_id=' + id
                    });
                },
                getCompetitorById : function( id ) {
                    return $http({
                        method : 'GET',
                        url : AuthRepository.getApiUri() + 'competitor/' + id
                    });
                },
                getCompetitors : function( ) {
                    return $http({
                        method : 'GET',
                        url : AuthRepository.getApiUri() + 'competitor/'
                    });
                },
                getKitStates : function(){
                    return $http({
                        method : 'GET',
                        url : AuthRepository.getApiUri() + 'kitstate/'
                    });
                },
                getRegisterStates : function(){
                    return $http({
                        method : 'GET',
                        url : AuthRepository.getApiUri() + 'registerstate/'
                    });
                },
                getCategories : function(id){
                    return $http({
                        method : 'GET',
                        url : AuthRepository.getApiUri() + 'competition/categories/?competition_id=' + id
                    });
                }
        };
    }])
    .controller( 'CompetitionsController', [ '$scope', '$rootScope', '$routeParams', 'CompetitionsRepository', function( $scope, $rootScope, $routeParams, CompetitionsRepository ) {
        // Verify if there is an id on route params
        if( $routeParams.id )
        {
            // Get the competition by id
            CompetitionsRepository.getById( $routeParams.id ).success( function(data) {
                $scope.competition_detail = data['data'];
            }).error( function(error) {
                // Notify the error if there is one
            });
            CompetitionsRepository.getRegisters( $routeParams.id ).success( function(data) {
                $scope.registers = data['data'];
            }).error( function(error) {
                // Notify the error if there is one
            });
            // Get all the competitors from the event
            CompetitionsRepository.getCompetitors( ).success( function(data) {
                $scope.competitors = data['data'];
            }).error( function(error) {
                // Notify the error
            });
            // get the kit states
            CompetitionsRepository.getKitStates( ).success( function(data) {
                $scope.kitstates = data['data'];
            }).error( function(error) {
                // Notify the error
            });
            // Get the register states
            CompetitionsRepository.getRegisterStates( ).success( function(data) {
                $scope.registerstates = data['data'];
            }).error( function(error) {
                // Notify the error
            });
            CompetitionsRepository.getCategories( $routeParams.id ).success( function(data) {
                $scope.categories = data['data'];
            }).error( function(error) {
                // Notify the error
            });
        }
    }]);

// Filters
application
    .filter( 'getCompetitorsName', [ function( ) {
        return function(x, scope) {
            function findCompetitor( competitor ){
                return competitor.id === x;
            }
            return scope.competitors.find(findCompetitor).name + ' ' + scope.competitors.find(findCompetitor).second_name;
        };
    }])
    .filter( 'getKitStateDes', [function() {
        return function( x , scope){
            function findState( state ){
                return state.id === x;
            }
            return scope.kitstates.find(findState).description;
        };
    }])
    .filter( 'getRegisterStateDes', [function() {
        return function( x , scope){
            function findState( state ){
                return state.id === x;
            }
            return scope.registerstates.find(findState).description;
        };
    }]);
