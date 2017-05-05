// user strategy

module.exports = function(passport , Company){

var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({
    usernameField: 'email'
  },
  function(email, password, done) {
    Company.findOne({ email: email }, function (err, company) {
      if (err) { return done(err); }
      // Return if user not found in database
      if (!company) {
        return done(null, false, {
          message: 'Company not found'
        });
      }
      // Return if password is wrong
      if (!company.validPassword(password)) {
        return done(null, false, {
          message: 'Password is wrong'
        });
      }
      // If credentials are correct, return the user object
      return done(null, company);
    });
  }
));
}