var express = require('express');
var app = express();
var request = require('request');

// Set up public routes


app.use(express.static('public'));

var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/userAccountsDB')
var userAccountSchema = mongoose.Schema({
    _id: String,
    username: String,
    url: String
});
var userAccount = mongoose.model("userAccount", userAccountSchema);

var serverSchema = mongoose.Schema({
    _id:String
})
var server = mongoose.model("server", serverSchema)

// File System
const fs = require('fs');
var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

function getLightestServerUrl(){
    if (registeredAppServers.length == 0) return "http://www.google.com";
    var lightestServer = null;
    var numUsers = 0;
    var random = Math.floor(Math.random() * (registeredAppServers.length));
    return registeredAppServers[random]
}

function createNewUser(userID, username){
    var chosenURL = getLightestServerUrl();
    var newAccount = new userAccount({
      "_id":userID,
      "username":username,
      "url":chosenURL
    })
    newAccount.save();
    return newAccount;
}

var registeredAppServers = [];

function fromLoginGetDatabaseInfo(userID, username, res){
    userAccount.findOne({"_id": userID}, function(err,user) {
      if (err) return console.error(err);
      else {
        console.log(user);
        if (!user){ //there is no user with specified id. Create a new one
            user = createNewUser(userID, username);
        }
        if (user.url == "http://www.google.com"){
            res.json({
              "id": userID,
              "url": user.url
            })
            return;
        }
        request.post({
            url: user.url,
            form: user
        },
        function(response){
            res.json({
              "id": userID,
              "url": user.url
            })
        })
      }
    })
}

function run(config){

    app.get('/',function (req, res){
        res.sendFile('views/index.html',{root: __dirname})
    })

    app.get('/login', function (req, res) {
        // Verify user credentials and assign to a slave server.
    })


    app.post('/registerAppServer', function(req, res, next) {
      var url = "http://" + req.ip.substring(7, req.ip.length);
      url += (':' + req.body.port);
      registeredAppServers.push(url);
      server.save({"_id":url});
      console.log(registeredAppServers);
      res.send("your url was" + req.ip);
    })


    app.post('/facebookCallback', function (req, res) {
      console.log("Got something back from Facebook")
      console.log(req.body)
    })

    /**
     * The handler for getting information back from Google
     *
     */
    app.post('/googleCallback', function (req, res) {
      fromLoginGetDatabaseInfo(req.body.username, req.body.userId, res)
      console.log("Got something back from Google")
      console.log(req.body)
    })

    app.listen(config.port, function () {
      console.log('Example app listening on port',config.port + '!')
    })

}
