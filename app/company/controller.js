var passport = require('passport');
var multer  =   require('multer');
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './public/uploads');
  },
  filename: function (req, file, callback) {
   var fname = Date.now()+file.originalname;
     var offer = new Offer();
     if (req.body.choice) {
      offer.title = req.body.title;
      for(i = 0 ; i < req.body.choice.length ; i++){
      offer.nested.push({name : req.body.choice[i] , votes : 0 });
      }
      offer.ended_at = req.body.ended_at;
      offer.file = fname;
      offer._company = req.body._company;
      offer.servey = true;
     }
     else {
  offer.title = req.body.title;
  offer.type = req.body.type;
  offer.category = req.body.category;
  offer.price = req.body.price;
  offer._company = req.body._company;
  offer.file = fname;
  offer.ended_at = req.body.ended_at;
  }
  offer.save(function(err) {
   if (err) {
    res.status(406);
    return res.json({
      "message" : "There is a problem contact the webmaster please"
    });

      
   }
  });

    callback(null,fname);
  }
});



var profile =   multer.diskStorage({
  destination: function (req, logo, callback) {
    callback(null, './public/uploads/logos');
  },
  filename: function (req, logo, callback) {
   var fname = Date.now()+logo.originalname;
    callback(null,fname);
  }
});

var uploadlogo = multer({ storage : profile}).single('logo');




var upload = multer({ storage : storage}).single('file');


var Company = require('./Company');
var Offer = require('./Offer');

require('../config/company-passport')(passport,Company);





module.exports.profile =  function (req, res) {

  // If no company ID exists in the JWT return a 401

  if (!req.user._id) {
     res.status(401).json({
      "message" : "UnauthorizedError: private data"
    });
  } else {
    // Otherwise continue
    Company
      .findById({ _id : req.user._id} , { password: 0 , salt : 0})
      .exec(function(err, company) {
        console.log('we are here !!!');
        res.status(200).json(company);
      });
  }

};



module.exports.profileupdate =  function (req, res) {

        uploadlogo(req,res,function(err) {
    if (!req.user._id) {
     return res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
    // Otherwise continue
    Company
      .findById(req.user._id)
      .exec(function(err, company) {
        if (err) return res.status(401).json({
      "message" : err
    });
        if (req.body.password) {
          company.setPassword(req.body.password);
        }
        console.log(req.body);

        company.name = req.body.name;
        company.email = req.body.email;
        company.activity = req.body.activity;
        company.category = req.body.category;
        company.size = req.body.size;
        company.email = req.body.email;
        company.phone = req.body.phone;
        company.adress = req.body.adress;
        company.country = req.body.country;
        company.logo = req.file && req.file.filename || company.logo;

        console.log(company);
        company.save(function(err , company){
        if (err) return res.status(401).json({
      "message" : "Error: Contact the webmaster please"
    });
        return res.status(200).json(company);
          
          });
      });
  }



    });    

};

module.exports.privateoffers =  function (req, res) {

  // If no company ID exists in the JWT return a 401

  if (!req.user._id) {
     res.status(401).json({
      "message" : "UnauthorizedError: private data"
    });
  } else {
    // Otherwise continue
    Offer
      .find({ _company : req.user._id , servey : false})
      .populate('_company')
      .exec(function(err, offers) {
        console.log('we are here !!!');
        res.status(200).json(offers);
      });
  }

};
module.exports.privateserveys =  function (req, res) {

  // If no company ID exists in the JWT return a 401

  if (!req.user._id) {
     res.status(401).json({
      "message" : "UnauthorizedError: private data"
    });
  } else {
    // Otherwise continue
    Offer
      .find({ _company : req.user._id , servey : true})
      .populate('_company')
      .exec(function(err, offers) {
        console.log('we are here !!!');
        res.status(200).json(offers);
      });
  }

};

module.exports.alloffers =  function (req, res) {

date = new Date();
    Offer
      .find({ended_at : { $gt : date} })
      .populate('_company')
      .exec(function(err, offers) {
        if (err)
        return res.status(406).json({'message' : 'Error : Contact the webmaster please .'});

        res.status(200).json(offers);
      });


};
module.exports.singleoffer =  function (req, res) {

    Offer
      .findById({_id : req.params.id})
      .populate('_company')
      .exec(function(err, offer) {
        if (err)
        return res.status(406).json({'message' : 'Error : Contact the webmaster please .'});

        res.status(200).json(offer);
      });


};


module.exports.register = function(req, res) {
  var company = new Company();
    console.log("heree register");
   console.log(req.body);
  company.name = req.body.name;
  company.email = req.body.email;

  company.setPassword(req.body.password);
   console.log("setpass done");
  company.save(function(err) {
    var token;    
    token = company.generateJwt();
   console.log("gentoken done");

    res.status(200);
    res.json({
      "token" : token
    });
    console.log("doooone");
  });
};

module.exports.login = function(req, res) {

  passport.authenticate('company-local', function(err, company, info){
    var token;

    // If Passport throws/catches an error
    if (err) {
      res.status(404).json(err);
      return;
    }

    // If a company is found
    if(company){
      token = company.generateJwt();
      res.status(200);
      res.json({
        "token" : token
      });
    } else {
      // If company is not found
      res.status(401).json(info);
    }
  })(req, res);

};


// offers routes

module.exports.addoffer = function(req, res) {
 
 
        upload(req,res,function(err) {
        if(err) {
         res.status(406);
    return res.json({
      "message" : "Vefiry your file please"
    });

        }
         res.status(200);
    return res.json({
      "message" : "Success upload"
    });
        



    });    
  

};

module.exports.deleteoffer = function(req, res) {
 
 
        Offer.findByIdAndRemove(req.params.id , function(err , offer){
          if(err) {
         res.status(406);
    return res.json({
      "message" : "Error"
    });

        }
         res.status(200);
    return res.json({
      "message" : "Success"
    });
        



    });    
  

};


// ****

var updateoffer_storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './public/uploads');
  },
  filename: function (req, file, callback) {
   var fname = Date.now()+file.originalname;
    callback(null,fname);
  }
});

var update_offer = multer({ storage : updateoffer_storage}).single('file');


// ****





module.exports.updateoffer = function(req, res ) {
        update_offer(req,res,function(err) {
        if(err) {
         res.status(406);
    return res.json({
      "message" : "Vefiry your Data please"
    });

        }
      Offer.findById(req.params.id)
      .exec(function(err, offer) {
        if (err) return res.status(401).json({
      "message" : err
      });
      console.log(offer);
     if (offer.servey === true) {
      offer.title = req.body.title;
      console.log(req.body.nested);
      for(i = 0 ; i < req.body.nested.length ; i++){
        if (offer.nested[i]) {
      offer.nested[i].name = req.body.nested[i].name;
      }
      else {
        offer.nested.push({ name : req.body.nested[i].name });
      }
      }
      offer.ended_at = req.body.ended_at;
        offer.file = req.file && req.file.filename || offer.file;
     }
     else {
  offer.title = req.body.title;
  offer.type = req.body.type;
  offer.category = req.body.category;
  offer.price = req.body.price;
  offer.file = req.file && req.file.filename || offer.file;
  offer.ended_at = req.body.ended_at;
  }
  offer.save(function(err) {
   if (err) {
    res.status(406);
    return res.json({
      "message" : "There is a problem contact the webmaster please"
    });

      
   }
  });

        
         res.status(200);
    return res.json({
      "message" : "Success upload"
    });
        



    });    
  

});

};
