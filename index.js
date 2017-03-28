var express = require('express')
var app = express()

// File System
const fs = require('fs');

// Read configuration file before running.
fs.readFile('config.json',function(err,data){
    if(err){
        console.log("Unable to read server configuration file!");
    }
    else{
        data = JSON.parse(data);
        console.log("Found data:",data);
        run(data);
    }
})


function run(config){

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.listen(config.port, function () {
  console.log('Example app listening on port',config.port + '!')
})

}
