var express = require('express');
var app = express();
// Set up public routes
app.use(express.static('public'));

// Mongo DB

// File System
const fs = require('fs');

// Read configuration file before running.
fs.readFile('config.json',function(err,data){
    if(err){
        console.log("Unable to read server configuration file!");
    }
    else{
        data = JSON.parse(data);
        // console.log("Found data:",data);
        run(data);
    }
})


function run(config){

app.get('/',function (req, res){
    res.sendFile('views/index.html',{root: __dirname})
})

app.get('/login', function (req, res) {
    // Verify user credentials and assign to a slave server.
})

app.listen(config.port, function () {
  console.log('Example app listening on port',config.port + '!')
})

}
