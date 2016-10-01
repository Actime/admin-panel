var express = require('express');
var router = express();
var User = require( '../models/users.js' );
var bodyParser = require( 'body-parser' );
var urlLib = require( 'url' );

// create application/json parser 
var jsonParser = bodyParser.json();

//
// user post; create
//
router.post( '/', jsonParser, function(req, res) {

    var user = new User();

    user.name = req.body.params.name;
    user.email = req.body.params.email;
    user.username = req.body.params.username;
    user.facebook_id = req.body.params.facebook_id;
    user.twitter_id = req.body.params.twitter_id;
    user.facebook_account = "";
    user.twitter_account = "";

    console.log( "This is the params of the request" );
    console.log( req.body );
    console.log( req.body.params );
    
    if( req.body.params.user_image == "" ) 
    {
        var random_num = Math.floor((Math.random() * 3) + 1);
        switch( random_num ) {
            case 1 :
                user.user_image = "http://i.imgur.com/IvW0ASv.png";
                break;
            case 2 :
                user.user_image = "http://i.imgur.com/UDhue18.png";
                break;
            case 3 : 
                user.user_image = "http://i.imgur.com/FY37R0t.png";
                break;
        }
    }
    else 
    {
        user.user_image = req.body.params.user_image;
    }

    user.save();

    res.send( { 'message': 'created', 'data' : user } );

}); // end of create route

router.get('/byFbId', jsonParser, function(req, res){
    var url_parts = urlLib.parse(req.url, true);
    console.log( url_parts.query );
    User.findOne( { facebook_id:url_parts.query.facebook_id }, function(err, user){
        if(err)
        {
            res.json( { 'message' : 'error', 'err' : err } );
        }
        res.json( { 'message' : 'ok', 'data' : user } );
    });
});// End of get by facebook id

/*
* update user
*/
router.put( '/', jsonParser, function( req, res ){
    User.findOne( {facebook_id:req.body.params.facebook_id}, function(err, user){
        if( err )
        {
            res.json( { 'message' : 'error', 'err' : err } );
        }

        user.name = req.body.params.name;
        user.email = req.body.params.email;
        user.username = req.body.params.username;
        user.facebook_account = req.body.params.facebook_account;
        user.twitter_account = req.body.params.twitter_account;
        
        user.save( function(err){
            if( err ) 
            {
                res.json( { 'message' : 'error' , 'err' : err } );
            }
            res.json( { 'message' : 'updated', 'data' : user } );
        });

    });
});// End of update user 

/*
* get all users
*/
router.get( '/', jsonParser, function(req, res){
    User.find({}, function(err, users){
        if( err ) 
        {
            console.log(err);
            res.json( { 'message' : 'error', 'err' : err } );
        }
        console.log(users);
        res.send( {'message': 'ok', 'data' : users } );
    });
}); // End of get all users 

router.delete( '/:id', jsonParser, function(req, res){
    var id = req.params.id;
    User.findById( id, function(err, user){
        if( err )
        {
            res.json( { 'message' : 'error', 'err' : err } );
        }
        user.remove( function(err){
            if(err)
            {
                res.json( { 'message' : 'error', 'err' : err } );
            }
            res.json( { 'message' : 'deleted' } );
        });
    });
});// End of delte user route

// Export the router to the module
module.exports = router;
