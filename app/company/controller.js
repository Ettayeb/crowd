var passport = require('passport');
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
   console.log(req);

  if (!req.user._id) {
     res.status(401).json({
      "message" : "UnauthorizedError: private data"
    });
  } else {
   console.log(req);
    // Otherwise continue
    Offer
      .findOne({ _company : req.user._id})
      .exec(function(err, offers) {
        console.log('we are here !!!');
        res.status(200).json(offers);
      });
  }

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

  passport.authenticate('local', function(err, company, info){
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