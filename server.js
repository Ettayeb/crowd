//== Modules
var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var mongoose = require('mongoose');
//== Configs
var db = require('./app/config/db');
var port = process.env.PORT || 8080 ;

//==
mongoose.connect(db.url); 
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(methodOverride('X-HTTP-Method-Override')); 
app.use(express.static(__dirname + '/public'));


// routes ==================================================
require('./app/routes')(app); // configure our routes

// frontend routes =========================================================
// route to handle all angular requests
app.get('/*', function(req, res) {
    res.sendFile(__dirname + '/public/index.html'); // load our public/index.html file
});


app.listen(port);


exports = module.exports = app; 