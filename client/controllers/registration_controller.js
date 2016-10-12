application
    .factory( 'RegistersRepository', [ '$http', 'AuthRepository', function( $http, AuthRepository ) {
        return({
            getRegisters : function() {
                return $http({
                    method : 'GET',
                    headers : AuthRepository.getFullJSONHeader(),
                    url : AuthRepository.getApiUri() + 'register/'
                });
            },
            getAllCompetitors : function() {
                return $http({
                    method : 'GET',
                    headers : AuthRepository.getFullJSONHeader(),
                    url : AuthRepository.getApiUri() + 'competitor/'
                });
            },
            getCompetitorsNumber : function( id ){
                return $http({
                    method : 'GET',
                    headers : AuthRepository.getFullJSONHeader(),
                    url : AuthRepository.getApiUri() + 'register/competitornum/' + id
                });
            },
            getRegisterById : function( id ) {
                return $http({
                    method : 'GET',
                    headers : AuthRepository.getFullJSONHeader(),
                    url : AuthRepository.getApiUri() + 'register/' + id
                });
            },
            newCompetitor : function( data ) {
                var jsonData = JSON.stringify({
                    name : data.name,
                    second_name : data.second_name,
                    birth_date : data.birth_date,
                    city : data.city,
                    state : data.state,
                    country : data.country,
                    zip_code : data.zip_code,
                    address : data.address,
                    address2 : data.address2,
                    email : data.email,
                    user : AuthRepository.getSession().id,
                    sex : data.sex,
                    phone_number : data.phone_number
                });
                return $http({
                    method : 'POST',
                    headers : AuthRepository.getFullJSONHeader(),
                    url : AuthRepository.getApiUri() + 'competitor/',
                    data : jsonData
                });
            },
            newRegister : function( data ) {
                var jsonData = JSON.stringify({
                    competitor : data.competitor,
                    competition : data.competition,
                    category : data.category,
                    competitor_num : data.competitor_num,
                    user : AuthRepository.getSession().id,
                    register_state : data.register_state,
                    kit_state : data.kit_state,
                    team : data.team
                });
                return $http({
                    method : 'POST',
                    headers : AuthRepository.getFullJSONHeader(),
                    url : AuthRepository.getApiUri() + 'register/',
                    data : jsonData
                });
            },
            updateRegister : function( data ) {
                var jsonData = JSON.stringify({
                    competitor : data.competitor,
                    competition : data.competition,
                    category : data.category,
                    competitor_num : data.competitor_num,
                    user : AuthRepository.getSession().id,
                    register_state : data.register_state,
                    kit_state : data.kit_state,
                    team : data.team
                });
                return $http({
                    method : 'PUT',
                    headers : AuthRepository.getFullJSONHeader(),
                    url : AuthRepository.getApiUri() + 'register/' + data.id,
                    data : jsonData
                });
            },
            getCompetitorById : function( id ) {
                return $http({
                    method : 'GET',
                    headers : AuthRepository.getFullJSONHeader(),
                    url : AuthRepository.getApiUri() + 'competitor/' + id
                });
            },
            deleteRegister : function( id ) {
                return $http({
                    method : 'DELETE',
                    headers : AuthRepository.getFullJSONHeader(),
                    url : AuthRepository.getApiUri() + 'register/' + id
                });
            }
        });
    }])
    .controller( 'PoSController', [ '$scope', '$location', '$routeParams', '$mdDialog', 'RegistersRepository', 'CompetitionsRepository', 'EventRepository', 'StatesService', function( $scope, $location, $routeParams, $mdDialog, RegistersRepository, CompetitionsRepository, EventRepository, StatesService ) {
        // load all the evets function
        var load_events = function() {
            EventRepository.getAll().success( function(data) {
                $scope.events = data['data'];
                $scope.events_filtered = $scope.events;
            }).error( function(error) {
                $.notify( "There was an error loanding the events.", "error" );
            });
        };
        // load all the competitors function
        var load_competitors = function() {
            RegistersRepository.getAllCompetitors().success( function( data ) {
                $scope.competitors = data['data'];
            }).error( function( error ) {
                $.notify( "There was an error getting the Competitors from the system.", "error" );
            });
        };
        var load_competitions = function( id ) {
            EventRepository.getCompetitions( id ).success( function(data) {
                $scope.competitions = data['data'];
            }).error( function(error) {
                $.notify( "There was an error gettitng the competitions from the system.", "error" );
            });
        };
        var load_all_competitions = function() {
            CompetitionsRepository.getAllCompetitions().success( function( data ) {
                $scope.competitions = data['data'];
                $scope.competitions = $scope.competitions.map( function( competition ) {
                    competition.competition_event = $scope.events.find( event_obj => event_obj.id === competition.competition_event );
                    return competition;
                });
                // load pending_registers
                load_pending_registers();
                // load kits not returned
                load_kits_not_returned();
            }).error( function( error ) {
                $.notify( "There was an error getting the compeitions form the system.", "error" );
            });
        };
        var load_teams = function() {
            CompetitionsRepository.getTeams().success( function(data) {
                $scope.teams = data['data'];
            }).error( function(error) {
                $.notify( "There was an error getting the teams from the system.", "error" );
            });
        };
        var load_pending_registers = function() {
            RegistersRepository.getRegisters().success( function( data ) {
                $scope.pending_registers = data['data'];
                $scope.pending_registers = $scope.pending_registers.map( function( register ) {
                    register.competition = $scope.competitions.find( competition => competition.id === register.competition );
                    return register;
                });
                $scope.pending_registers = $scope.pending_registers.filter( register => register.register_state === 2 );
                $scope.pending_registers_filtered = $scope.pending_registers;
            }).error( function( error ) {
                $.notify( "There was an error getting the Registers from the system", "error" );
            });
        };
        var load_kits_not_returned = function() {
            RegistersRepository.getRegisters().success( function( data ) {
                $scope.not_returned_kits = data['data'];
                $scope.not_returned_kits = $scope.not_returned_kits.map( function( register ) {
                    register.competition = $scope.competitions.find( competition => competition.id === register.competition );
                    return register;
                });
                $scope.not_returned_kits = $scope.not_returned_kits.filter( register => register.kit_state === 3 || register.kit_state === 9 );
                $scope.not_returned_kits_filtered = $scope.not_returned_kits;
            }).error( function( error ) {
                $.notify( "There was an error getting the registers from the system", "error" );
            });
        };
        var load_states = function() {
            CompetitionsRepository.getRegisterStates().success( function( data ) {
                $scope.register_states = data['data'];
            }).error( function( error ) {
                $.notify( "There was an error getting the register states for the system.", "error" );
            });
        };
        // Pos window
        if( $location.path() === '/pos/' ) {
            // load the events
            EventRepository.getAll().success( function( data ) {
                $scope.events = data['data'];
                $scope.events_filtered = $scope.events;
                load_all_competitions();
            }).error( function( error ) {
                $.notify( "There was an error loanding the events.", "error" );
            });
            load_competitors();
            // change search for events
            $scope.changeSearch = function() {
                $scope.events_filtered = $scope.events.filter( function(event_obj) {
                    return event_obj.name.includes( $scope.txt_events_search );
                });
            };
            // change search for pending registers
            $scope.changeSearchRegisters = function() {
                $scope.pending_registers_filtered = $scope.pending_registers.filter( function( register ) {
                    var returned_comp = $scope.competitors.find( competitor => competitor.id === register.competitor );
                    return ( returned_comp.name + ' ' + returned_comp.second_name ).includes( $scope.txt_pending_registers_search );
                });
            };
            // change search for pending registers
            $scope.changeSearchKits = function() {
                $scope.not_returned_kits_filtered = $scope.not_returned_kits.filter( function( register ) {
                    var returned_comp = $scope.competitors.find( competitor => competitor.id === register.competitor );
                    return ( returned_comp.name + ' ' + returned_comp.second_name ).includes( $scope.txt_not_returned_kits_search );
                });
            };
        } else if( $location.path().includes( '/registers/new/' ) ) {
            // Init the registration model
            $scope.register = { category : null, competition : null, register_state : 1, kit_state : 1, team : 2, competitor : 0 };
            // load the competitors
            load_competitors();
            // load the competitions
            load_competitions( $routeParams.id );
            // load the states
            load_states();
            // load the teams
            load_teams();
            // When search text changes
            $scope.changeSearch = function() {
                $scope.competitors_filtered = $scope.competitors.filter( function(competitor) {
                    return ( competitor.name + ' ' + competitor.second_name ).includes( $scope.txt_competitors_search );
                });
            };
            // When competition change
            $scope.competitionChange = function() {
                // Get the categories filtered by the choosen competition
                CompetitionsRepository.getCategoriesByCompetition( $scope.register.competition.id ).success( function( data ) {
                    $scope.categories = data['data'];
                }).error( function( error ) {
                    $.notify( "There was an error getting the categories from the system.", "error" );
                });
            };
            // When competitor is clicked
            $scope.selectCompetitor = function( competitor ){
                // Code for selected competitor
                $scope.isNewCompetitor = true;
                $scope.competitor = competitor;
            };
            // clean the fields
            $scope.newCompetitorCBChange = function() {
                if( !$scope.isNewCompetitor ) {
                    $scope.competitor = null;
                }
            };
            // new register function
            $scope.newRegister = function() {
                // if isNewCompetitor then register competitor first
                if( !$scope.isNewCompetitor ) {
                    // Get the birth_date
                    var d1 = new Date( document.getElementById( 'birth_date' ).value );
                    $scope.competitor.birth_date = d1.toISOString( "yyyy-MM-ddTHH:mm:ss" ).substring(0,10);
                    // Add competitor to the system and then return it
                    RegistersRepository.newCompetitor( $scope.competitor ).success( function( data ) {
                        $scope.competitor = data;
                    }).error( function( error ) {
                        $.notify( "There was an error adding the Competitor to the system", "error" );
                    });
                }
                // Return the competitiors number
                RegistersRepository.getCompetitorsNumber( $scope.register.competition.id ).success( function( data ) {
                    // the competitor as an id
                    $scope.register.competitor = $scope.competitor.id;
                    // then register the register daaah on the system.
                    $scope.register.category = $scope.register.category.id;
                    $scope.register.competition = $scope.register.competition.id;
                    $scope.register.register_state = $scope.register.register_state.id;
                    $scope.register.team = $scope.register.team.id;
                    $scope.register.kit_state = 9;
                    $scope.register.competitor_num = parseInt( data['data'] );
                    // Send to the confirmation page after adding the register
                    RegistersRepository.newRegister( $scope.register ).success( function( data ) {
                        $scope.register_detail = data;
                        $.notify( "The register has been successfuly added to the system.", "success" );
                        $location.path( '/registers/cfm/' + $scope.register_detail.id );
                    }).error( function( error ) {
                        $.notify( "There was an error adding the Register to the system.", "error" );
                    });
                }).error( function( error ) {
                    $.notify( "There was an error getting the Competitors Number from the System.", "error" );
                });

            };
        } else if( $location.path().includes( '/registers/cfm/' ) ) {
            // Get the register by id
            RegistersRepository.getRegisterById( $routeParams.id ).success( function( data ) {
                $scope.register_detail = data['data'];
                RegistersRepository.getCompetitorById( $scope.register_detail.competitor ).success( function( data ) {
                    $scope.register_detail.competitor = data['data'];
                }).error( function( error ) {
                    $.notify( "There was an error getting the competitor.", "error" );
                });
            }).error( function( error ) {
                $.notify( "There was an error getting the register by id from the system.", "error" );
            });
            // then update with the option selected
            $scope.kitDelivered = function(){
                $scope.register_detail.kit_state = 3;
                $scope.register_detail.competitor = $scope.register_detail.competitor.id;
                RegistersRepository.updateRegister( $scope.register_detail ).success( function( data ) {
                    $.notify( "Register states as delivered.", "success" );
                    $location.path( '/pos/' );
                }).error( function( error ) {
                    $.notify( "There was an error updating the Register", "error" );
                });
            };
            $scope.kitPending = function(){
                $scope.register_detail.kit_state = 9;
                $scope.register_detail.competitor = $scope.register_detail.competitor.id;
                RegistersRepository.updateRegister( $scope.register_detail ).success( function( data ) {
                    $.notify( "Register states as pending...", "warn" );
                    $location.path( '/pos/' );
                }).error( function( error ) {
                    $.notify( "There was an error updating the Register", "error" );
                });
            };
        } else if( $location.path().includes( '/registers/edit/' ) ) {
            StatesService.getAllKitStates().success( function( data ) {
                $scope.kit_states = data['data'];
                StatesService.getAlLRegisterStates().success( function( data ) {
                    $scope.register_states = data['data'];
                    CompetitionsRepository.getTeams().success( function( data ) {
                        $scope.teams = data['data'];
                    }).error( function( error ) {
                        $.notify( "There was an error getting the teams from the system.", "error" );
                    });
                    RegistersRepository.getRegisterById( $routeParams.id ).success( function( data ) {
                        $scope.register_detail = data['data'];
                        RegistersRepository.getCompetitorById( $scope.register_detail.competitor ).success( function( data ) {
                            $scope.register_detail.competitor = data['data'];
                        }).error( function( error ) {
                            $.notify( "There was an error getting the competitor from the system.", "error" );
                        });
                        CompetitionsRepository.getCompetitionById( $scope.register_detail.competition ).success( function( data ) {
                            $scope.register_detail.competition = data['data'];
                            EventRepository.getById( $scope.register_detail.competition.competition_event ).success( function( data ) {
                                $scope.register_detail.competition.competition_event = data['data'];
                            }).error( function( error ) {
                                $.notify( "There was an error getting the event from the system.", "error" );
                            });
                        }).error( function( error ) {
                            $.notify( "There was an error getting the competition from the sytem.", "error" );
                        });
                        $scope.register_detail.kit_state = $scope.kit_states.find( state => state.id === $scope.register_detail.kit_state );
                        $scope.register_detail.team = $scope.teams.find( team => team.id === $scope.register_detail.team );
                        $scope.register_detail.register_state = $scope.register_states.find( state => state.id === $scope.register_detail.register_state );
                    }).error( function( error ) {
                        $.notify( "There was an error getting the register from the system.", "error" );
                    });
                }).error( function( error ) {
                    $.notify( "There was an error getting the register states fron the system.", "error" );
                });
            }).error( function( error ) {
                $.notify( "There was an error getting the kit states form the system.", "error" );
            });
            // Show delete confirmation dialog
            $scope.deleteRegister = function( ev, id ){
                // Appending dialog to document.body to cover sidenav in docs app
                var confirm = $mdDialog.confirm()
                    .title('Would you like to delete the Register?')
                    .textContent("After you delete this, It won't be possible to get it back.")
                    .ariaLabel('Lucky day')
                    .targetEvent(ev)
                    .ok('Delete Register')
                    .cancel('Cancel');
                // confirmation dialog
                $mdDialog.show(confirm).then(function() {
                    RegistersRepository.deleteRegister( id ).success( function(data) {
                        $.notify( "Your Register has been deleted.", "warn" );
                        $location.path( '/pos/' );
                    }).error( function(error) {
                        $.notify( "Something went wrong.", "error" );
                    });
                }, function() {
                    // Nofity the error or cancelation
                });
            };
            $scope.updateRegister = function() {
                $scope.register_detail.competitor = $scope.register_detail.competitor.id;
                $scope.register_detail.competition = $scope.register_detail.competition.id;
                $scope.register_detail.kit_state = $scope.register_detail.kit_state.id;
                $scope.register_detail.register_state = $scope.register_detail.register_state.id;
                $scope.register_detail.team = $scope.register_detail.team.id;
                RegistersRepository.updateRegister( $scope.register_detail ).success( function( data ) {
                    $.notify( "Register successfuly updated in the system.", "success" );
                    $location.path( '/pos/' );
                }).error( function( error ) {
                    $.notify( "There was an error updating the register on the system.", "error" );
                });
            };
        }
    }]);
