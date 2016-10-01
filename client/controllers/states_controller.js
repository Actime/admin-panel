application
    .factory( 'StatesService', [ '$http', '$cookies', 'AuthRepository', function( $http, $cookies, AuthRepository ) {
        return({
            getAllKitStates : function(){
                return $http({
                    method : 'GET',
                    url : AuthRepository.getApiUri() + 'kitstate'
                });
            },
            getAlLRegisterStates : function(){
                return $http({
                    method : 'GET',
                    url : AuthRepository.getApiUri() + 'registerstate'
                });
            }
        });
    }])
    .controller( 'KitStatesController', [ '$scope', 'StatesService', function( $scope, StatesService ) {
        StatesService.getAllKitStates().success(function(data){
            $scope.kit_states = data['data'];
            // Change the data to arrays
            var the_array = Array();
            for( d in data['data'] ){
                var da = data['data'][d];
                var temp_array = [ da['id'], da['description'], da['value'] ];
                the_array.push( temp_array );
            }
            $scope.kit_states_arrays = the_array;
            console.log( $scope.kit_states_arrays );
        }).error(function(error){
            // handle error
        });
    }])
    .controller( 'RegisterStatesController', [ '$scope', 'StatesService', function( $scope, StatesService ) {
        StatesService.getAlLRegisterStates().success(function(data){
            $scope.register_states = data['data'];
        }).error(function(error){
            // Handle the error
        });
    }]);
