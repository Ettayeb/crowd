//== Modules
var express = require("express");
var app = express();
var bodyParser = require('body-parser');

//== Configs
var db = require('.config/db');
var port = process.env.PORT || 8080 ;

//==
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(methodOverride('X-HTTP-Method-Override')); 
app.use(express.static(__dirname + '/public'));



require('./app/routes')(app); // configure our routes


app.listen(port);


exports = module.exports = app; 