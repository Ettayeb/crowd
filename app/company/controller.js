var passport = require('passport');
var multer  =   require('multer');
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './public/uploads');
  },
  filename: function (req, file, callback) {
   var fname = Date.now()+file.originalname;
     var offer = new Offer();
  offer.title = req.body.title;
  offer.type = req.body.type;
  offer._company = req.body._company;
  offer.file = fname;
  offer.ended_at = req.body.ended_at;

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

var upload = multer({ storage : storage}).single('file');


var Company = require('./Company');
var Offer = require('./Offer');

require('../config/company-passport')(passport,Company);


module.exports.profileRead =  function (req, res) {

  // If no company ID exists in the JWT return a 401
  if (!req.payload._id) {
     res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
    // Otherwise continue
    Company
      .findById(req.payload._id)
      .exec(function(err, company) {
        console.log('we are here !!!');
        res.status(200).json(company);
      });
  }

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
      .find({ _company : req.user._id})
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

