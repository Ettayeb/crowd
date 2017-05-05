var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
mongoose.Promise = require('bluebird');

var Schema = mongoose.Schema ;

var UserSchema = new Schema({
   email : {type : String , required : true ,  unique : true},
   name : {type : String , required : true},
   password : {type : String , required : true},
   salt : {type : String , required : true},
   description : {type : String },
   created_at : Date ,
   updated_at : Date
    
    
});

UserSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.password = crypto.pbkdf2Sync(password, this.salt, 1000, 64,'sha1').toString('hex');  
    };
UserSchema.methods.validPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64,'sha1').toString('hex');
    return this.password === hash;
};
UserSchema.methods.generateJwt = function() {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);  // token expire after 7 days
    console.log(expiry.getDate());
    return jwt.sign({
        _id: this._id,
        email: this.email,
        name: this.name,
        exp: parseInt(expiry.getTime() / 1000),
    }, "MY_SECRET"); // DO NOT KEEP YOUR SECRET IN THE CODE!
};



UserSchema.pre("save" , function(next){
   var date = Date();
   this.updated_at = date;
   if (!this.created_at) this.created_at = date;
   
   next(); 
    
});


var User = mongoose.model("User" , UserSchema);

module.exports = User;