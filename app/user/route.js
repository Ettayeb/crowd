
var User = require('./User');


module.exports = function(app,mongoose,jwt,auth){

controller = require('./controller');

app.post('/api/userlogin', controller.login);
app.post('/api/user', controller.register);

      app.get('/api/users', auth, controller.profileRead);
        app.get('/api/users', function(req, res) {

            User.find(function(err, users) {

                // if there is an error retrieving, send the error. 
                                // nothing after res.send(err) will execute
                if (err)
                    res.send(err);

                res.json(users); 
            });
        });

        };