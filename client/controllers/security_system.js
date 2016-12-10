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
            },
            getFullJSONHeader : function(){
                return({
                    'Content-Type' : 'application/json',
                    'Authorization' : this.getTheFullAuthHeader()
                });
            },
            getUserDetail : function() {
                return $http({
                    method : 'GET',
                    headers : this.getFullJSONHeader(),
                    url : this.getApiUri() + 'user/' + this.getSession().id
                });
            },
            getUserSystemDetail : function( id ) {
                return $http({
                    method : 'GET',
                    headers : this.getFullJSONHeader(),
                    url : this.getApiUri() + 'usersystem/' + id
                });
            },
            getRolDetail : function( id ) {
                return $http({
                    method : 'GET',
                    headers : this.getFullJSONHeader(),
                    url : this.getApiUri() + 'rol/' + id
                });
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
        $scope.setMenuWithRol = function( rol ) {
            if( rol.name == "Administrador" ) {
                $rootScope.NavBarPanel.home = true;
                $rootScope.NavBarPanel.events = true;
                $rootScope.NavBarPanel.categories = true;
                $rootScope.NavBarPanel.states = true;
                $rootScope.NavBarPanel.pos = true;
                $rootScope.NavBarPanel.general = true;
                $rootScope.NavBarPanel.tasks = true;
            } else if( rol.name == "Cobrador" ) {
                $rootScope.NavBarPanel.home = true;
                $rootScope.NavBarPanel.events = false;
                $rootScope.NavBarPanel.categories = false;
                $rootScope.NavBarPanel.states = false;
                $rootScope.NavBarPanel.pos = true;
                $rootScope.NavBarPanel.general = false;
                $rootScope.NavBarPanel.tasks = false;
            } else if( rol.name == "General" ) {
                $rootScope.NavBarPanel.home = true;
                $rootScope.NavBarPanel.events = true;
                $rootScope.NavBarPanel.categories = false;
                $rootScope.NavBarPanel.states = false;
                $rootScope.NavBarPanel.pos = true;
                $rootScope.NavBarPanel.general = true;
                $rootScope.NavBarPanel.tasks = false;
            } else if( rol.name == "Application" || rol.name == "Competidor" ) {
                $rootScope.NavBarPanel.home = false;
                $rootScope.NavBarPanel.events = false;
                $rootScope.NavBarPanel.categories = false;
                $rootScope.NavBarPanel.states = false;
                $rootScope.NavBarPanel.pos = false;
                $rootScope.NavBarPanel.general = true;
                $rootScope.NavBarPanel.show = false;
                $rootScope.NavBarPanel.tasks = false;
            }
        };
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
                AuthRepository.getUserSystemDetail( the_data.pk ).success( function( us_data ) {
                    var usersystem_data = us_data['data'];
                    AuthRepository.getRolDetail( usersystem_data.rol ).success( function( r_data ) {
                        var rol_data = r_data['data'];
                        AuthRepository.getUserDetail().success( function(data) {
                            $rootScope.user_info = data['data'];
                            $rootScope.user_info.rol = rol_data;
                            $rootScope.NavBarPanel.show = true;
                            $scope.setMenuWithRol( $rootScope.user_info.rol );
                        }).error( function(error) {
                            console.log( "There was an error getting the user from the system [user]." );
                        });
                        $location.path( '/' );
                    }).error( function( error ) {
                        console.log( "There was an error getting the user from the system [rol]." );
                    });
                }).error( function( error ) {
                    console.log( "There was an error getting the user from the system [usersystem]." );
                });
            }).error(function(erro){
                // notify the error
                $.notify( "Wrong Credentials.", "error");
            });
        };
    }])
    .controller( 'NavBarController', [ '$scope', '$rootScope', '$location', 'AuthRepository', function( $scope, $rootScope, $location, AuthRepository ) {
        // Init the nav bar panel variable
        $rootScope.NavBarPanel = {
            show : true, // Set show default true
            home : false,
            events : false,
            categories : false,
            states : false,
            pos : false,
            general : false,
            tasks : false
        };
        $scope.setMenuWithRol = function( rol ) {
            if( rol.name == "Administrador" ) {
                $rootScope.NavBarPanel.home = true;
                $rootScope.NavBarPanel.events = true;
                $rootScope.NavBarPanel.categories = true;
                $rootScope.NavBarPanel.states = true;
                $rootScope.NavBarPanel.pos = true;
                $rootScope.NavBarPanel.general = true;
                $rootScope.NavBarPanel.tasks = true;
            } else if( rol.name == "Cobrador" ) {
                $rootScope.NavBarPanel.home = true;
                $rootScope.NavBarPanel.events = false;
                $rootScope.NavBarPanel.categories = false;
                $rootScope.NavBarPanel.states = false;
                $rootScope.NavBarPanel.pos = true;
                $rootScope.NavBarPanel.general = false;
                $rootScope.NavBarPanel.tasks = false;
            } else if( rol.name == "General" ) {
                $rootScope.NavBarPanel.home = true;
                $rootScope.NavBarPanel.events = true;
                $rootScope.NavBarPanel.categories = false;
                $rootScope.NavBarPanel.states = false;
                $rootScope.NavBarPanel.pos = true;
                $rootScope.NavBarPanel.general = true;
                $rootScope.NavBarPanel.tasks = false;
            } else if( rol.name == "Application" || rol.name == "Competidor" ) {
                $rootScope.NavBarPanel.home = false;
                $rootScope.NavBarPanel.events = false;
                $rootScope.NavBarPanel.categories = false;
                $rootScope.NavBarPanel.states = false;
                $rootScope.NavBarPanel.pos = false;
                $rootScope.NavBarPanel.general = true;
                $rootScope.NavBarPanel.show = false;
                $rootScope.NavBarPanel.tasks = false;
            }
        };
        // If not loggedin
        if( !AuthRepository.isSessionSet() ) {
            $rootScope.NavBarPanel.show = false;
            $location.path( '/login/' );
        } else {
            AuthRepository.getUserSystemDetail( AuthRepository.getSession().id ).success( function( us_data ) {
                var usersystem_data = us_data['data'];
                AuthRepository.getRolDetail( usersystem_data.rol ).success( function( r_data ) {
                    var rol_data = r_data['data'];
                    AuthRepository.getUserDetail().success( function(data) {
                        $rootScope.user_info = data['data'];
                        $rootScope.user_info.rol = rol_data;
                        $rootScope.NavBarPanel.show = true;
                        $scope.setMenuWithRol( $rootScope.user_info.rol );
                    }).error( function( error ) {
                        console.log( "There was an error getting the user from the system [user]." );
                    });
                    $location.path( '/' );
                }).error( function( error ) {
                    console.log( "There was an error getting the user from the system [rol]." );
                });
            }).error( function( error ) {
                console.log( "There was an error getting the user from the system [usersystem]." );
            });
        }
        // Log out function
        $scope.logout = function(){
            // Remove the session
            AuthRepository.removeSession();
            // Set the nav bar panel variable to false
            $rootScope.NavBarPanel.show = false;
            $rootScope.user_info = null;
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
            $rootScope.user_info = null;
            // redirect to the login view
            $location.path( '/login/' );
        };
    }]);
