var express = require('express');
var app = express();
var request = require('request');
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
        register(data);
    }
})


app.post('/registered',function(req,res){
        console.log(req.body);
});


function register(data){
    request.post({
        url:"http://34.208.82.175:3000/registerAppServer",
        form: data
    },function(response){
	console.log("Registry complete with:", response);
        run(data);
    })
}

// Event Queue
// var eventQueueClass = require('./javascript/eventQueue')
// var eventQueue = new eventQueueClass(500); // half second delay

function run(config){
    // eventQueue.run();

    // Eventually there will be no GET
    app.get('/', function (req, res) {
      res.sendFile('views/index.html',{root: __dirname})
    })

    // User data needed event
    app.post("/users/:id",function(req, res){
        // Find the user with the matching ID and use some of the post data to send back key user data
    })

    app.listen(config.port, function () {
      console.log('Example app listening on port',config.port + '!')
    })

}
