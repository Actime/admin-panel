// Get the mongoose lib
var mongoose = require('mongoose');
// Get the schema and the boject id objects from the mongoose lib
var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

var UserSchema = new Schema({  
    name: String,
    email: { type: String, index: { unique: true } },
    username: { type: String, index: { unique: true } },
    user_image: String,
    facebook_id: { type: String, index: { unique: true } },
    twitter_id : { type: String },
    facebook_account: String,
    twitter_account: String,
    dates: { 
        created: { 
            type: Date, default: Date.now 
        }, 
    },
});// End of UserSchema model

// Set the model name, the name it will be used in the routing
var User = mongoose.model('User', UserSchema);
// Export the models to the module
module.exports = User;