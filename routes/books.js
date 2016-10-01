
var express = require( 'express' );
var router = express();
var Book = require( '../models/books.js' );
var Fragment = require( '../models/fragments.js' );
var bodyParser = require( 'body-parser' );
var urlLib = require( 'url' );

// application json parser
var jsonParser = bodyParser.json();

//
// create
//
router.post( '/', jsonParser, function(req, res){

    var book = new Book();

    book.title = req.body.params.title;
    book.font = req.body.params.font;
    book.user = req.body.params.user;

    book.save();

    res.send( { 'message' : 'created', 'data' : book } );

});// End of create function

//
// add write to book by id and write id on the body
//
router.post( '/write/:id', jsonParser, function( req, res ) {

    var id = req.params.id;
    var write_id = req.body.params.write_id;

    Book.findById( id, function(err, book) {
        if (err)
        {
            throw err;
        }
        Fragment.findById( write_id, function( err, fragment ){
            if(err)
            {
                throw err;
            }
            book.fragments.push( fragment );
            res.json( { 'message' : 'ok', 'data' : book } );
        });
    });
});// End of add write to book function

//
// List all the books not matter the user
//
router.get( '/', function( req, res ){

    Book.find( {}, function( err, books ){
        if (err)
        {
            res.json( { 'message' : 'error', 'err' : err } );
        }
        res.json( { 'message' : 'ok', 'data' : books } );
    }); // End of find function

});// End of Get all function

router.put( '/shares_facebook/:id', function(req, res) {
    var id = req.params.id;
    Book.findById( id, function(err, book) {
        if(err)
        {
            throw err;
        }
        book.shares_facebook++;
        book.save(function(err){
            if(err)
            {
                res.json({ 'message' : 'error', 'err' : err });
            }
            res.json( { 'message' : 'updated', 'shares_facebook' : book.shares_facebook } );
        });
    });

});// End of update shares_facebook function

router.put( '/prints/:id', function(req, res) {
    var id = req.params.id;
    Book.findById( id, function(err, book) {
        if(err)
        {
            throw err;
        }
        book.shares_twitter++;
        book.save(function(err){
            if(err)
            {
                res.json({ 'message' : 'error', 'err' : err });
            }
            res.json( { 'message' : 'updated', 'shares_twitter' : book.shares_twitter } );
        });
    });

});// End of update shares_facebook function

router.put( '/prints/:id', function(req, res) {
    var id = req.params.id;
    Book.findById( id, function(err, book) {
        if(err)
        {
            throw err;
        }
        book.prints++;
        book.save(function(err){
            if(err)
            {
                res.json({ 'message' : 'error', 'err' : err });
            }
            res.json( { 'message' : 'updated', 'prints' : book.prints } );
        });
    });

});// End of update shares_facebook function

//
// update by id
//
router.put( '/:id', jsonParser, function( req, res ){
    var id = req.params.id;
    var updated_data = {
        title : req.body.params.title,
        font : req.body.params.font
    };
    Book.findByIdAndUpdate( id, updated_data, function(err, book){
        if(err)
        {
            throw err;
        }
        res.json( { 'message' : 'updated', 'data' : book } );
    });
});// End of update by id function

//
// get by id
//
router.get( '/:id', function( req, res ) {
    var id = req.params.id;
    Book.findById( id, function(err, book){
        if(err)
        {
            throw err;
        }
        res.json( { 'message' : 'ok', 'data' : book } );
    });
});// End of get by id function

//
// Deletes a book by id from the db
//
router.delete( '/:id', function(req, res){
    var id = req.params.id;
    Book.findByIdAndRemove( id, function( err ){
        if (err)
        {
                throw err;
        }
        res.json( { 'message' : 'deleted', 'data' : 'The book has been deleted.' } );
    });
});// End of delete function

module.exports = router
