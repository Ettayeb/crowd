var passport = require('passport');
var User = require('./User');
var Apply = require('./Apply');


var multer  =   require('multer');
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './public/uploads/apply');
  },
  filename: function (req, file, callback) {
   var fname = Date.now()+file.originalname;
   console.log(req.body);
   apply = new Apply();
   apply._user = req.body.userid;
   apply._offer = req.body.offerid;
   apply.file = fname;
   apply.save(function(err) {
       console.log(err);

  });

    callback(null,fname);
  }
});

var upload = multer({ storage : storage}).single('file');





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

  passport.authenticate('user-local', function(err, user, info){
    var token;
    if (err) {
      console.log(err);
      return res.status(401).json(err);
    }

    // If a user is found
    if(user){
      token = user.generateJwt();
      return res.status(200).json({
        "token" : token
      });
    } else {
      // If user is not found
      res.status(401).json(info);
    }
  })(req, res);

};

module.exports.apply = function(req , res){
           upload(req,res,function(err) {
        if(err) {
         res.status(406);
    return res.json({
      "message" : "Vefiry your file please"
    });

        }
        console.log("we are here");
         res.status(200);
    return res.json({
      "message" : "Successfuly uplied"
    });
});   
           };

module.exports.getapplies = function(req , res){
  if(req.params.id){
    Apply.find({_offer : req.params.id})
    .populate('_offer')
    .populate('_user')
    .exec(function(err , applies){
      if(err)
      return res.status(406).json({
      "message" : "Contact the webmaster"});
    return res.status(200).json(applies);
      });
    
  }
  else {
          return res.status(406).json({
      "message" : "Contact the webmaster"});

  }
  
  
};
module.exports.applied = function(req , res){
  if(req.params.id){
    Apply.findOne({_user : req.params.id})
    .populate('_offer')
    .populate('_user')
    .exec(function(err , apply){
      if(err)
      return res.status(406).json({
      "message" : "Contact the webmaster"});
    return res.status(200).json(apply);
      });
  }
  
  
  
};

