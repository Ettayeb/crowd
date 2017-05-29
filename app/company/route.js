var Company = require('./Company');


module.exports = function(app,mongoose,companyAuth){

require('../config/company-passport');
controller = require('./controller');

app.post('/api/company', controller.register);
app.post('/api/companylogin', controller.login);
app.post('/api/company/profile',companyAuth, controller.profileupdate);
app.get('/api/company/profile/:id',companyAuth, controller.profile);

app.get('/api/privateserveys',companyAuth, controller.privateserveys);
app.get('/api/privateoffers',companyAuth, controller.privateoffers);
app.post('/api/offer', companyAuth , controller.addoffer);
app.put('/api/offer/:id',companyAuth, controller.updateoffer);
app.delete('/api/offer/:id',companyAuth, controller.deleteoffer);



app.get('/api/offers' , controller.alloffers);
app.get('/api/offer/:id' , controller.singleoffer);





};