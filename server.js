var express = require("express");

var app = express();


app.get("/" , function(req , res) {
   res.send("test"); 
    
    
});

app.listen("8000", function() {
    console.log("Everything is going well bro");
    
    });