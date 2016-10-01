application
    .factory( 'AuthRepository', [ '$http', '$cookies', function( $htttp, $cookies ) {
        return {
            getBase64 : function( user, password ){
                return btoa( user + ":" + password );
            },
            getApiUri : function( ){
                return "https://rfid-system-gunt2raro.c9users.io/api/";
            },
            validateLogin : function( user, password ){

            },
            getTheFullAuthHeader : function(){

            },
            getAppkeys : function(){
                var app_user = "";
                var app_password = "";
                return btoa( user + ":" + password );
            },
            isSessionSet : function(){
                return true;
            }
        }
    }]);
