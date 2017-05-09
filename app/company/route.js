var Company = require('./Company');


module.exports = function(app,mongoose,companyAuth){

require('../config/company-passport');
controller = require('./controller');

app.post('/api/company', controller.register);
app.post('/api/companylogin', controller.login);
app.get('/api/privateoffers',companyAuth, controller.privateoffers);
app.post('/api/offer', companyAuth , controller.addoffer);


};