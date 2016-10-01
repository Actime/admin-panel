//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var http = require('http');
var path = require('path');

var async = require('async');
var socketio = require('socket.io');
var express = require('express');

// var uristring =
    //process.env.MONGOLAB_URI ||
    //process.env.MONGOHQ_URL ||
    //'mongodb://localhost/instapoesia_db'
//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);

/// My resources, not all the shit you see
//var fragments = require( './routes/fragments.js' );

router.use(express.static(path.resolve(__dirname, 'client')));

// The fragments routes
//router.use( '/api/write', fragments );

var messages = [];
var sockets = [];

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});
