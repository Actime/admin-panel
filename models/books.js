var mongoose = require('mongoose');
var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

var BookSchema = new Schema({
	id : ObjectId,
	title : { type : String, default : "" },
	font: { type : String, default : "" },
	shares_facebook : { type : Number, default : 0 },
	shares_twitter : { type : Number, default : 0 },
	prints : { type : Number, default : 0 },
	user: { type : ObjectId, ref : 'UserSchema' },
	fragments: [ { type : ObjectId, ref : 'FragmentSchema' } ],
	dates: {
        created:  { type: Date, default : Date.now },
    },
});// End of bookschema

// Set the model schema
var Book = mongoose.model('Book', BookSchema);
// Export the model to the module
module.exports = Book;
