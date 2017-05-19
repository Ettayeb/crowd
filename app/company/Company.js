var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
mongoose.Promise = require('bluebird');

var Schema = mongoose.Schema ;

var CompanySchema = new Schema({
   email : {type : String , required : true ,  unique : true},
   name : {type : String , required : true},
   activity : {type : String , required : false},
   category : {type : String , required : false},
   size : {type : String , required : false},
   country : {type : String , required : false},
   region : {type : String , required : false},
   adress : {type : String , required : false},
   country_code : {type : String , required : false},
   phone : {type : String , required : false},
   logo : {type : String , required : false},   
   password : {type : String , required : true},
   salt : {type : String , required : true},
   description : {type : String , required : false},
   created_at : Date ,
   updated_at : Date
        
});

CompanySchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.password = crypto.pbkdf2Sync(password, this.salt, 1000, 64 , 'sha1').toString('hex');  
    };
CompanySchema.methods.validPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64,'sha1').toString('hex');
    return this.password === hash;
};
CompanySchema.methods.generateJwt = function() {
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



CompanySchema.pre("save" , function(next){
   var date = Date();
   this.updated_at = date;
   if (!this.created_at) this.created_at = date;
   
   next(); 
    
});


var Company = mongoose.model("Company" , CompanySchema);

module.exports = Company;