var passport = require('passport');
var User = require('./User');
require('../config/user-passport')(passport,User);



module.exports.profileRead =  function (req, res) {

  // If no user ID exists in the JWT return a 401
  if (!req.payload._id) {
     res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
    // Otherwise continue
    User
      .findById(req.payload._id)
      .exec(function(err, user) {
        console.log('we are here !!!');
        res.status(200).json(user);
      });
  }

};

module.exports.register = function(req, res) {
  var user = new User();
    console.log("heree register");
   console.log(req.body);
  user.name = req.body.name;
  user.email = req.body.email;

  user.setPassword(req.body.password);
   console.log("setpass done");
  user.save(function(err) {
   
   if (err){
   res.status(406);
    res.json({
      "message" : "Email already exist"
    });
   return; 
      
      
   }
    var token;
    
    token = user.generateJwt();
   console.log("gentoken done");

    res.status(200);
    res.json({
      "token" : token
    });
    console.log("doooone");
  });
};

module.exports.login = function(req, res) {

  passport.authenticate('local', function(err, user, info){
    var token;

    // If Passport throws/catches an error
    if (err) {
      console.log(err);
      res.status(401).json(err);
      return;
    }

    // If a user is found
    if(user){
      token = user.generateJwt();
      res.status(200);
      res.json({
        "token" : token
      });
    } else {
      // If user is not found
      res.status(401).json(info);
    }
  })(req, res);

};