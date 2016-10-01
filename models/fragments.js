var mongoose = require('mongoose');
var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

//
// Fragment schema
// fragment wich is a writing on the view
// @title - is the title of the model and is optional
// @content - is the content of the write and is obligatory
// @quotation - is the citation of the writing, optional
// @collections - is the times a write has been added to a collection
// @shares_facebook - is the time a write has been shared with facebook
// @shares_twitter - is the time a write has been shared with twitter
// @reports - is the time a write has benn report
// @anonymous - is the boolean of the write if is anonymous or not
// @user -  is the user that post it
// @font - is the kind of letter the write has
// @dates - are the dates created and updated
var FragmentSchema = new Schema({

	id : ObjectId,
 	title : String,
	content : String,
	quotation : String,
	collections : Number,
	shares_facebook : Number,
	shares_twitter : Number,
	reports : Number,
	anonymous : Number,
	user: { type: ObjectId, ref: 'UserSchema' },
	font: String,
	dates: {
        created:  { type: Date, default: Date.now },
    },

});// End of fragment schema model

// Set the model schema
var Fragment = mongoose.model('Fragment', FragmentSchema);
// Export the model to the module
module.exports = Fragment;
