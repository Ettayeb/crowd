var mongoose = require("mongoose");

var Schema = mongoose.Schema ;

var OfferSchema = new Schema({
    title      : String,
    _company    : {type: mongoose.Schema.Types.ObjectId, ref: 'Company'},
    type      : String ,
    file       : { type : String },
    ended_at    : Date,
    updated_at : Date,
    created_at :Date
    });

OfferSchema.pre("save" , function(next){
   var date = Date();
   this.updated_at = date;
   if (!this.created_at) {
    this.created_at = date;
   }
   
   next(); 
    
});

var Offer = mongoose.model("Offer",OfferSchema);


module.exports = Offer;