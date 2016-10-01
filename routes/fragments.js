
var express = require('express');
var router = express();
var Fragment = require( '../models/fragments.js' );
var bodyParser = require( 'body-parser' );
var urlLib = require( 'url' );

// create application/json parser
var jsonParser = bodyParser.json();

//
// poems post; create
//
router.post( '/', jsonParser, function(req, res) {

	var fragment = new Fragment();

	fragment.title = req.body.params.title;
	fragment.content = req.body.params.content;
	fragment.quotation = req.body.params.quotation;
	fragment.user = req.body.params.user_id;
	fragment.collections = 0;
	fragment.anonymous = req.body.params.anonymous;
	fragment.shares_facebook = 0;
	fragment.shares_twitter = 0;
	fragment.reports = 0;
	fragment.font = req.body.params.font;

	console.log( fragment );
	fragment.save();

	res.send( { 'message': 'created', 'data' : fragment } );

}); // end of create route

//
// poems get; read
//
router.get( '/', function( req, res ) {

	var url_parts = urlLib.parse(req.url, true);

	Fragment.find({}, function(err, fragments){
		if( err )
		{
			console.log(err);
			res.json( { 'message' : 'error', 'err' : err } );
		}
		res.send( {'message': 'ok', 'data' : fragments } );
	}).skip( parseInt( url_parts.query.p ) * 40 ).limit( 40 );

}); // End of read route

//
// Get by id; get
//
router.get( '/:id', function(req, res){
	var id = req.params.id;
	Fragment.findById( id, function(err, fragment){
		if(err)
		{
  			res.json( { 'message' : 'error', 'err' : err } );
		}
		res.json( { 'message' : 'ok', 'data' : fragment } );
	});
});// End of get by id

//
// get the writes by user id
//
router.get( '/u/:id', jsonParser, function(req, res) {
	var user_id = req.params.id;
	Fragment.find( { user : user_id }, function(err, fragments) {
		if(err)
		{
			throw err;
		}
		res.json( { 'message' : 'ok', 'data' : fragments } );
	});// End of get all fragmets
}); // End of get by user id

//
// poems put; update
//
router.put( '/', jsonParser, function( req, res ){

	Fragment.findById( req.body.id, function(err, fragment){
		if( err )
		{
  			res.json( { 'message' : 'error', 'err' : err } );
		}

		fragment.title = req.body.params.title;
		fragment.content = req.body.params.content;
		fragment.quotation = req.body.params.quotation;
		fragment.font = req.body.params.font;

		fragment.save( function(err){
			if( err )
			{
				res.json( { 'message' : 'error' , 'err' : err } );
			}
			res.json( { 'message' : 'updated', 'data' : fragment } );
		});
	});

}); // End of update route

//
// poem delete; delete
//
router.delete( '/', jsonParser, function( req, res ){
	Fragment.findById( req.body.id, function(err, fragment){
		if( err )
		{
			res.json( { 'message' : 'error', 'err' : err } );
		}
		fragment.remove( function(err){
			if(err)
			{
				res.json( { 'message' : 'error', 'err' : err } );
			}
			res.json( { 'message' : 'deleted' } );
		});
	});
});// End of delete

//
// poems post shares
//
router.post( '/shares_facebook', jsonParser, function(req, res) {

	Fragment.findById( req.body.id, function(err, fragment){

		if( err )
		{
			res.json( { 'message' : 'error', 'err' : err } );
		}
		// Up to one the shares
		fragment.shares_facebook++;
		// Save the fragment
		fragment.save( function(err){
			if( err )
			{
				res.json( { 'message' : 'error', 'err' : err } );
			}
			res.json( { 'message' : 'ok', 'shares_facebook' : fragment.shares_facebook } )
		} );

	});// End of find by id

});// End of post repeat

router.post( '/shares_twitter', jsonParser, function(req, res){

	Fragment.findById( req.body.id, function(err, fragment){

		if(err)
		{
			res. json( { 'message' : 'error', 'err' : err } );
		}
		// up to one the shares
		fragment.shares_twitter++;
		// Save the fragment
		fragment.save( function(err){
			if (err)
			{
				res.json( { 'message' : 'error', 'err' : err } );
			}
			res.json( { 'message' : 'ok', 'shares_twitter' : fragment.shares_twitter } );
		});

	});// End of find by id

} );// End of post shares_twitter route

// Export the router to the module
module.exports = router;
