application
    .factory( 'CategoriesRepository', [ '$http', '$cookies', 'AuthRepository', function( $http, $cookies, AuthRepository ) {
        return({
            getAll : function() {
                return $http({
                    method : 'GET',
                    headers : {
                        'Content-Type' : 'application/json',
                        'Authorization' : AuthRepository.getTheFullAuthHeader()
                    },
                    url : AuthRepository.getApiUri() + 'category/'
                });
            },
            addCategory : function( data ){
                var jsonData = JSON.stringify({
                    name : data.name,
                    description : data.description,
                    age_1 : data.age_1,
                    age_2 : data.age_2,
                    user : AuthRepository.getSession().id,
                    color : "Red"
                });
                return $http({
                    method : 'POST',
                    headers : {
                        'Content-Type' : 'application/json',
                        'Authorization' : AuthRepository.getTheFullAuthHeader()
                    },
                    url : AuthRepository.getApiUri() + 'category/',
                    data : jsonData
                });
            },
            deleteCategory : function( id ) {
                return $http({
                    method : 'DELETE',
                    headers : {
                        'Content-Type' : 'application/json',
                        'Authorization' : AuthRepository.getTheFullAuthHeader()
                    },
                    url : AuthRepository.getApiUri() + 'category/' + id
                });
            }
        });
    }])
    .controller( 'CategoriesController', [ '$scope', '$rootScope', '$mdDialog', 'CategoriesRepository', function( $scope, $rootScope, $mdDialog, CategoriesRepository ){
        // load categories function
        var load_categories = function() {
            CategoriesRepository.getAll().success(function(data){
                $scope.categories = data['data'];
            }).error(function(error){
                $.notify( "There was an error getting the categories.", "error" );
            });
        };
        // init the category model function
        var init_category = function(){
            $scope.category = { name : "", description : "", age_1 : null, age_2 : null };
        };
        // Init the cateogry model
        init_category();
        // load the categories
        load_categories();
        // add new category
        $scope.newCategory = function(){
            CategoriesRepository.addCategory( $scope.category ).success( function(data) {
                $.notify( "The Category '" + $scope.category.name + "', has been successfuly added.", "success" );
                load_categories();
                init_category();
            }).error( function(error) {
                $.notify( "There was a problem addding the Category.", "error" );
            });
        };
        // show delete confirmation dialog
        $scope.showDeleteConfirm = function( ev, id ){
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title('Would you like to delete the Category?')
                .textContent("After you delete this, It won't be possible to get it back.")
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('Delete Category')
                .cancel('Cancel');
            // Conirmation dialog
            $mdDialog.show(confirm).then(function() {
                CategoriesRepository.deleteCategory( id ).success( function(data) {
                    load_categories();
                    $.notify( "Your Category has been deleted.", "warn" );
                }).error( function(error) {
                    $.notify( "Something went wrong.", "error" );
                });
            }, function() {
                // Nofity the error or cancelation
            });
        };
        // Clear form function
        $scope.clear_form = init_category;
    }]);
