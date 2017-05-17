var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var Schema = mongoose.Schema ;

var ApplySchema = new Schema({
   _offer : {type : mongoose.Schema.Types.ObjectId, ref: 'Offer'},
   _user : {type : mongoose.Schema.Types.ObjectId, ref: 'User'},
   file : {type : String },
   votes : {type : Number },
   created_at : Date ,    
    
});




ApplySchema.pre("save" , function(next){
   var date = Date();
   if (!this.created_at) this.created_at = date;   
   next(); 
    
});


var Apply = mongoose.model("Apply" , ApplySchema);

module.exports = Apply;