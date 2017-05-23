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





require('../config/user-passport')(passport,User);


module.exports.profile =  function (req, res) {

  // If no company ID exists in the JWT return a 401

  if (!req.payload._id) {
     res.status(401).json({
      "message" : "UnauthorizedError: private data"
    });
  } else {
    // Otherwise continue
    User
      .findById({ _id : req.payload._id} , { password: 0 , salt : 0})
      .exec(function(err, user) {
        console.log('we are here !!!');
        res.status(200).json(user);
      });
  }

};



module.exports.profileupdate =  function (req, res) {

        uploadlogo(req,res,function(err) {
    if (!req.payload._id) {
     return res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
    // Otherwise continue
    User
      .findById(req.payload._id)
      .exec(function(err, user) {
        if (err) return res.status(401).json({
      "message" : err
    });
        if (req.body.password) {
          user.setPassword(req.body.password);
        }
        console.log(req.body);

        user.name = req.body.name;
        user.email = req.body.email;
        user.phone = req.body.phone;
        user.adress = req.body.adress;
        user.country = req.body.country;
        user.description = req.body.description;
        user.logo = req.file && req.file.filename || user.logo;

        console.log(user);
        user.save(function(err , user){
        if (err) return res.status(401).json({
      "message" : "Error: Contact the webmaster please"
    });
        return res.status(200).json(user);
          
          });
      });
  }



    });    

};



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

module.exports.privateuserapplies =  function (req, res) {

  // If no company ID exists in the JWT return a 401
  console.log(req);
  if (!req.payload._id) {
     return res.status(401).json({
      "message" : "UnauthorizedError: private data"
    });
  } else {
    // Otherwise continue
    Apply
      .find({ _user : req.payload._id})
      .populate('_offer')
      .exec(function(err, applies) {
        if(err)
        return res.status(401).json({
          "message" : "Error Data"
          });
        
        res.status(200).json(applies);
      });
  }

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

