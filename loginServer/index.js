var express = require('express');
var app = express();
// Set up public routes

app.use(express.static('public'));

var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/userAccountsDB')
var userAccountSchema = mongoose.Schema({
    _id: String,
    username: String,
    url: String
});
var userAccount = mongoose.model('userAccount', userAccountSchema);

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

function createNewUser(userID, username){
    var chosenURL = "http://www.placeholder.com";
    var testAccount1 = new userAccount({
      "_id":userID,
      "username":username,
      "url":chosenURL
    })
}

function fromLoginGetDatabaseInfo(userID, username){
    userAccount.findOne({"_id": userID}, function(err,user) {
      if (err) return console.error(err);
      else {
        console.log(user);
        if (!user){ //there is no user with specified id. Create a new one
            createNewUser(userID, username);
        }
        else{
            console.log(user[0])
        }
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

    app.post('/facebookCallback', function (req, res) {
      console.log("Got something back from Facebook")
      console.log(req.body)
    })

    app.post('/googleCallback', function (req, res) {
      console.log(req.body)
      //fromLoginGetDatabaseInfo(req.body.userId, req.body.username)
    })

    app.listen(config.port, function () {
      console.log('Example app listening on port',config.port + '!')
    })

}
