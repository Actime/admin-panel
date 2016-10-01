application
    .factory( 'CategoriesRepository', [ '$http', '$cookies', 'AuthRepository', function( $http, $cookies, AuthRepository ) {
        return({
            getAll : function() {
                return $http({
                    method : 'GET',
                    url : AuthRepository.getApiUri() + 'category/'
                });
            },
            getById : function( id ) {

            }
        });
    }])
    .controller( 'CategoriesController', [ '$scope', '$rootScope', 'CategoriesRepository', function( $scope, $rootScope, CategoriesRepository ){
        CategoriesRepository.getAll().success(function(data){
            $scope.categories = data['data'];
        }).error(function(error){
            // Deal with the error
        });
    }]);
