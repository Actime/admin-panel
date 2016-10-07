application
    .factory( 'StatesService', [ '$http', 'AuthRepository', function( $http, AuthRepository ) {
        return({
            getAllKitStates : function(){
                return $http({
                    method : 'GET',
                    headers : {
                        'Content-Type' : 'application/json',
                        'Authorization' : AuthRepository.getTheFullAuthHeader()
                    },
                    url : AuthRepository.getApiUri() + 'kitstate/'
                });
            },
            getAlLRegisterStates : function(){
                return $http({
                    method : 'GET',
                    headers : {
                        'Content-Type' : 'application/json',
                        'Authorization' : AuthRepository.getTheFullAuthHeader()
                    },
                    url : AuthRepository.getApiUri() + 'registerstate/'
                });
            },
            addKitState : function( data ) {
                var jsonData = JSON.stringify({
                    description : data.description,
                    value : data.value
                });
                return $http({
                    method : 'POST',
                    headers : {
                        'Content-Type' : 'application/json',
                        'Authorization' : AuthRepository.getTheFullAuthHeader( )
                    },
                    url : AuthRepository.getApiUri() + 'kitstate/',
                    data : jsonData
                });
            },
            deleteStates : function(id){
                return $http({
                    method : 'DELETE',
                    headers : {
                        'Content-Type' : 'application/json',
                        'Authorization' : AuthRepository.getTheFullAuthHeader( )
                    },
                    url : AuthRepository.getApiUri() + 'kitstate/' + id
                });
            },
            addRegisterState : function( data ) {
                var jsonData = JSON.stringify({
                    description : data.description,
                    value : data.value
                });
                return $http({
                    method : 'POST',
                    headers : {
                        'Content-Type' : 'application/json',
                        'Authorization' : AuthRepository.getTheFullAuthHeader( )
                    },
                    url : AuthRepository.getApiUri() + 'registerstate/',
                    data : jsonData
                });
            },
            deleteRegisterState : function(id) {
                return $http({
                    method : 'DELETE',
                    headers : {
                        'Content-Type' : 'application/json',
                        'Authorization' : AuthRepository.getTheFullAuthHeader( )
                    },
                    url : AuthRepository.getApiUri() + 'registerstate/' + id
                });
            }
        });
    }])
    .controller( 'KitStatesController', [ '$scope', '$mdDialog', 'StatesService', function( $scope, $mdDialog, StatesService ) {
        // Init the kit state varable
        $scope.kit_state = { description : "", value : 0 };
        // load the states function
        var load_states = function(){
            StatesService.getAllKitStates().success(function(data){
                $scope.kit_states = data['data'];
            }).error(function(error){
                $.notify( "There has been an error.", "error" );
            });
        };
        // load the states
        load_states();
        // Add new kit state model
        $scope.newKitState = function(){
            StatesService.addKitState( $scope.kit_state ).success( function(data) {
                $.notify( "The Kit state '" + $scope.kit_state.description + "' has been successfuly added.", "success" );
                load_states();
            }).error( function(error) {
                $.notify( "There has been an error adding a new kit state.", "error" );
            });
        };
        // Show Delete Confirm dialog
        $scope.showDeleteConfirm = function(ev, id) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title('Would you like to delete the Kit State?')
                .textContent("After you delete this, It won't be possible to get it back.")
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('Delete Kit State')
                .cancel('Cancel');
            // confirmation dialog
            $mdDialog.show(confirm).then(function() {
                StatesService.deleteStates( id ).success( function(data) {
                    load_states();
                    $.notify( "Your Kit State has been deleted.", "warn" );
                }).error( function(error) {
                    $.notify( "Something went wrong.", "error" );
                });
            }, function() {
                // Nofity the error or cancelation
            });
        };
    }])
    .controller( 'RegisterStatesController', [ '$scope', '$mdDialog', 'StatesService', function( $scope, $mdDialog, StatesService ) {
        // Init the register state variable
        $scope.register_state = { description : "", value : 0 };
        // load the states function
        var load_states = function() {
            StatesService.getAlLRegisterStates().success(function(data){
                $scope.register_states = data['data'];
            }).error(function(error){
                $.notify( "There has been an error.", "error" );
            });
        };
        // load the states
        load_states();
        // Add new register state model
        $scope.newRegisterState = function() {
            StatesService.addRegisterState( $scope.register_state ).success( function(data) {
                $.notify( "The Register State : '" + $scope.register_state.description + "', has been successfuly added.", "success" );
                load_states();
            }).error( function(error) {
                $.notify( "There was an error adding the Register State.", "error" );
            });
        };
        // Sho delete confirm dialog
        $scope.showDeleteConfirm = function(ev, id){
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title('Would you like to delete the Register State?')
                .textContent("After you delete this, It won't be possible to get it back.")
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('Delete Register State')
                .cancel('Cancel');
            // Conirmation dialog
            $mdDialog.show(confirm).then(function() {
                StatesService.deleteRegisterState( id ).success( function(data) {
                    load_states();
                    $.notify( "Your Register State has been deleted.", "warn" );
                }).error( function(error) {
                    $.notify( "Something went wrong.", "error" );
                });
            }, function() {
                // Nofity the error or cancelation
            });
        };
    }]);
