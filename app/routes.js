var mongoose = require('mongoose');
var jwt = require('express-jwt');

var userAuth = jwt({
  secret: 'MY_SECRET',
  userProperty: 'payload'
});


var companyAuth = jwt({
  secret: 'MY_SECRET',
  companyProperty: 'payload'
});
module.exports = function(app) {
// server routes ===========================================================
// handle things like api calls
// authentication routes
require('./user/route')(app,mongoose,userAuth,userAuth);
require('./company/route')(app,mongoose,companyAuth);




app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json("u got an error and you know why :/ have fun with that");
  }
});



}