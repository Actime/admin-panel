application
    .factory( 'CompetitionsRepository', [ '$http', '$cookies', 'AuthRepository', function( $http, $cookies, AuthRepository ) {
        return {
                getById : function( id ) {
                    return $http({
                        method : 'GET',
                        headers : {
                            'Content-Type' : 'application/json',
                            'Authorization' : AuthRepository.getTheFullAuthHeader()
                        },
                        url : AuthRepository.getApiUri() + 'competition/' + id
                    });
                },
                getRegisters : function( id ) {
                    return $http({
                        method : 'GET',
                        headers : {
                            'Content-Type' : 'application/json',
                            'Authorization' : AuthRepository.getTheFullAuthHeader()
                        },
                        url : AuthRepository.getApiUri() + 'register/bycompetition/?competition_id=' + id
                    });
                },
                getCompetitorById : function( id ) {
                    return $http({
                        method : 'GET',
                        headers : {
                            'Content-Type' : 'application/json',
                            'Authorization' : AuthRepository.getTheFullAuthHeader()
                        },
                        url : AuthRepository.getApiUri() + 'competitor/' + id
                    });
                },
                getCompetitors : function( ) {
                    return $http({
                        method : 'GET',
                        headers : {
                            'Content-Type' : 'application/json',
                            'Authorization' : AuthRepository.getTheFullAuthHeader()
                        },
                        url : AuthRepository.getApiUri() + 'competitor/'
                    });
                },
                getKitStates : function(){
                    return $http({
                        method : 'GET',
                        headers : {
                            'Content-Type' : 'application/json',
                            'Authorization' : AuthRepository.getTheFullAuthHeader()
                        },
                        url : AuthRepository.getApiUri() + 'kitstate/'
                    });
                },
                getRegisterStates : function(){
                    return $http({
                        method : 'GET',
                        headers : {
                            'Content-Type' : 'application/json',
                            'Authorization' : AuthRepository.getTheFullAuthHeader()
                        },
                        url : AuthRepository.getApiUri() + 'registerstate/'
                    });
                },
                getCategoriesByCompetition : function(id){
                    return $http({
                        method : 'GET',
                        headers : {
                            'Content-Type' : 'application/json',
                            'Authorization' : AuthRepository.getTheFullAuthHeader()
                        },
                        url : AuthRepository.getApiUri() + 'competition/categories/?competition_id=' + id
                    });
                },
                getAllCategories : function( ) {
                    return $http({
                        method : 'GET',
                        headers : {
                            'Content-Type' : 'application/json',
                            'Authorization' : AuthRepository.getTheFullAuthHeader()
                        },
                        url : AuthRepository.getApiUri() + 'category/'
                    });
                },
                getAllCompetitionTypes : function() {
                    return $http({
                        method : 'GET',
                        headers : {
                            'Content-Type' : 'application/json',
                            'Authorization' : AuthRepository.getTheFullAuthHeader()
                        },
                        url : AuthRepository.getApiUri() + 'competitiontype/'
                    });
                },
                newCompetition : function( data ) {
                    var jsonData = JSON.stringify({
                        name : data.name,
                        description : data.description,
                        competition_type : data.competition_type,
                        competition_event : data.competition_event,
                        user : AuthRepository.getSession().id,
                        categories : data.categories,
                        date_start : data.date_start,
                        date_finish : data.date_finish,
                        image_url : '',
                        competitors_limit : data.competitors_limit,
                        cost : data.cost
                    });
                    return $http({
                        method : 'POST',
                        headers : {
                            'Content-Type' : 'application/json',
                            'Authorization' : AuthRepository.getTheFullAuthHeader()
                        },
                        url : AuthRepository.getApiUri() + 'competition/',
                        data : jsonData
                    });
                },
                getTeams : function( ){
                    return $http({
                        method : 'GET',
                        headers : {
                            'Content-Type' : 'application/json',
                            'Authorization' : AuthRepository.getTheFullAuthHeader()
                        },
                        url : AuthRepository.getApiUri() + 'team/'
                    });
                },
                getAllCompetitions : function() {
                    return $http({
                        method : 'GET',
                        headers : {
                            'Content-Type' : 'application/json',
                            'Authorization' : AuthRepository.getTheFullAuthHeader()
                        },
                        url : AuthRepository.getApiUri() + 'competition/'
                    });
                },
                imageToCompetition : function( id, file ) {
                    var jsonData = JSON.stringify( file );
                    return $http({
                        method : 'PUT',
                        headers : {
                            'Content-Type' : 'application/json',
                            'Authorization' : AuthRepository.getTheFullAuthHeader()
                        },
                        url : AuthRepository.getApiUri() + 'competition/image/' + id,
                        data : jsonData
                    });
                },
                getCompetitionById : function( id ) {
                    return $http({
                        method : 'GET',
                        headers : {
                            'Content-Type' : 'application/json',
                            'Authorization' : AuthRepository.getTheFullAuthHeader()
                        },
                        url : AuthRepository.getApiUri() + 'competition/' + id
                    });
                }
        };
    }])
    .controller( 'CompetitionsController', [ '$scope', '$rootScope', '$routeParams', '$location', 'CompetitionsRepository', function( $scope, $rootScope, $routeParams, $location, CompetitionsRepository ) {
        // Verify if there is an id on route params
        if( $location.path().includes( '/competitions/new/' ) ) {
            $scope.onLoad = function (e, reader, file, fileList, fileOjects, fileObj) {
                $scope.route_image = fileObj.base64;
            };
            // Init the copmetition model
            $scope.competition = { name : '', description : '', date_start : '', date_finish : '', date_limit : '', competitors_limit : null, categories : [], competition_type : null, cost : null, competition_event : $routeParams.id };
            // load the categories
            CompetitionsRepository.getAllCategories().success( function( data ) {
                $scope.categories = data['data'];
            }).error( function( error ) {
                $.notify( "Something went wrong loanding the Categories.", "error" );
            });
            // Get all competition types
            CompetitionsRepository.getAllCompetitionTypes().success( function( data ) {
                $scope.competition_types = data['data'];
            }).error( function( error ) {
                $.notify( "There was an error getting all the competition types.", "error" );
            });
            // Add new competition function
            $scope.newCompetition = function() {
                // map the categories array
                $scope.competition.categories = $scope.competition.categories.map(function( category ) {
                    return category.id;
                });
                // change the competition_type to just the is
                $scope.competition.competition_type = $scope.competition.competition_type.id;
                // Set the dates on the competition
                var d1 = new Date( document.getElementById( 'date_start' ).value );
                var d2 = new Date( document.getElementById( 'date_finish' ).value );
                $scope.competition.date_start = d1.toISOString("yyyy-MM-ddTHH:mm:ss");
                $scope.competition.date_finish = d2.toISOString("yyyy-MM-ddTHH:mm:ss");
                // Add teh new competition
                CompetitionsRepository.newCompetition( $scope.competition ).success( function( data ) {
                    $.notify( "The competition : '" + $scope.competition.name + "', has been successfuly added.", "success" );
                    CompetitionsRepository.imageToCompetition( data.id, $scope.route_image ).success( function( data ) {
                        $.notify( "The route to the competition has been successfuly added.", "success" );
                        $location.path( '/events/' + $scope.competition.competition_event );
                    }).error( function( error ) {
                        $.notify( "There was an error adding the route to the competition.", "error" );
                        $location.path( '/events/' + $scope.competition.competition_event );
                    });
                }).error( function(error) {
                    $.notify( "There was an error adding the competition to the system.", "error" );
                });
            };
        } else {
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
            CompetitionsRepository.getCategoriesByCompetition( $routeParams.id ).success( function(data) {
                $scope.categories = data['data'];
            }).error( function(error) {
                // Notify the error
            });
        }
    }])
    .filter( 'getCompetitorsName', [ function( ) {
        return function(x, scope) {
            var returned_shit = scope.competitors.find( competitor => competitor.id === x );
            return returned_shit.name + ' ' + returned_shit.second_name;
        };
    }])
    .filter( 'getKitStateDes', [function() {
        return function( x , scope){
            var returned_shit =  scope.kitstates.find( kitstate => kitstate.id === x );
            return returned_shit.description;
        };
    }])
    .filter( 'getRegisterStateDes', [function() {
        return function( x , scope){
            var returned_shit =  scope.registerstates.find( registerstate => registerstate.id === x );
            return returned_shit.description;
        };
    }]);
