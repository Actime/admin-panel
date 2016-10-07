application
    .factory( 'AuthRepository', [ '$http', '$cookies', function( $http, $cookies ) {
        return {
            // getBase64Token : returns the user and password token
            getBase64Token : function( user, password ) {
                return btoa( user + ":" + password );
            },
            // getApiUri : This will return the api uri
            getApiUri : function( ){
                return "https://rfid-system-gunt2raro.c9users.io/api/";
            },
            // validateLogin : validates the username password on the api
            validateLogin : function( username, password ) {
                var jsonData = JSON.stringify({ username : username, password : password });
                return $http({
                    method : 'POST',
                    url : this.getApiUri() + 'user/login/',
                    data : jsonData
                });
            },
            // getTheFullAuthHeader returns the full Basic Authentication header value
            getTheFullAuthHeader : function( ) {
                return "Basic " + this.getSession().token;
            },
            // isSessionSet : returns if the session is set on the cookies
            isSessionSet : function() {
                var userCookie = $cookies.get('userdata');
                return ( userCookie == undefined ) ? false : true;
            },
            // setSession : sets the session on the cookies
            setSession : function( data ) {
                $cookies.putObject( 'userdata', data );
            },
            // getSession : returns the cookie session
            getSession : function() {
                var userCookie = $cookies.get('userdata');
                return ( userCookie == undefined ) ? undefined : JSON.parse(userCookie);
            },
            // removeSession : removes the session from the cookies
            removeSession : function() {
                $cookies.remove( 'userdata' );
            }
        }
    }])
    .controller( 'AuthController', [ '$scope', '$rootScope', '$location', 'AuthRepository', function( $scope, $rootScope, $location, AuthRepository ) {
        // init the user model
        $scope.user = { username : "", password : "" };
        // If not loggedin, load login path
        if( AuthRepository.isSessionSet() ) {
            // load login path
            $rootScope.NavBarPanel.show = true;
            // load on start path
            $location.path( '/' );
        }
        // login function
        $scope.login = function() {
            // Validate the username and the password
            AuthRepository.validateLogin( $scope.user.username, $scope.user.password ).success(function(data){
                var the_data = data['data'];
                var user_data = {
                    id : the_data.pk,
                    username : the_data.username,
                    token : AuthRepository.getBase64Token( the_data.username, the_data.password )
                };
                AuthRepository.setSession( user_data );
                $rootScope.NavBarPanel.show = true;
                $location.path( '/' );
            }).error(function(error){
                // notify the error
                $.notify( "Wrong Credentials", "error");
            });
        };
    }])
    .controller( 'NavBarController', [ '$scope', '$rootScope', '$location', 'AuthRepository', function( $scope, $rootScope, $location, AuthRepository ) {
        // Init the nav bar panel variable
        $rootScope.NavBarPanel = {
            show : true, // Set show default true
        };
        // If not loggedin
        if( !AuthRepository.isSessionSet() ) {
            $rootScope.NavBarPanel.show = false;
            $location.path( '/login/' );
        }
        // Log out function
        $scope.logout = function(){
            // Remove the session
            AuthRepository.removeSession();
            // Set the nav bar panel variable to false
            $rootScope.NavBarPanel.show = false;
            // redirect to the login view
            $location.path( '/login/' );
        }; // End of logout function
    }])
    .controller( 'MenuController', [ '$scope', '$rootScope', '$location', 'AuthRepository', function( $scope, $rootScope, $location, AuthRepository ) {
        // If not loggedin
        if( !AuthRepository.isSessionSet() ) {
            $location.path( '/login/' );
        }
        // Log out function
        $scope.logout = function(){
            // Remove the session
            AuthRepository.removeSession();
            // Set the nav bar panel variable to false
            $rootScope.NavBarPanel.show = false;
            // redirect to the login view
            $location.path( '/login/' );
        };
    }]);
