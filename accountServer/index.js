var express = require('express');
var app = express();
var request = require('request');

var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Set up public routes
app.use(express.static('public'));

// Mongo DB

// File System
const fs = require('fs');

var registry = "http://34.208.82.175:3000"


// Read configuration file before running.
fs.readFile('config.json',function(err,data){
    if(err){
        console.log("Unable to read server configuration file!");
    }
    else{
        data = JSON.parse(data);
        register(data);
    }
})


app.post('/registered',function(req,res){
        console.log(req.body);
});


function register(data){
    request.post({
        url: registry + "/registerAppServer",
        form: data
    },function(response){
        run(data);
    })
}


function run(config){

    var users = {}

    // Eventually there will be no GET
    app.get('/', function (req, res) {
      res.sendFile('views/index.html',{root: __dirname})
    })

    app.post('/userLogin', function(req, res) {
      if (!users.hasOwnProperty(req.body._id)) {
        user = {
          "id": req.body._id,
          "username": req.body.username,
          "subscriptions": [],
          "personal_story_descriptors": [],
          "personal_stories": {},
          "subscription_story_descriptors": {}}
        users[req.body._id] = user
      }
      res.send(users)
    })

    //Gets all users from the registry
    app.get('/users', function(req, res) {
      request.get(registry + "/allUsers", function(err, data) {
        res.send(JSON.parse(data.body))
      })
    })

    //Get all story descriptors for a user and their subscriptions
    app.get('/:id/stories', function(req, res) {
      var stories = users[req.params.id].subscriptions
      stories[req.params.id] = users[req.params.id].personal_story_descriptors
      res.send(stories)
    })

    //Get a specific story
    app.get('/:id/stories/:file', function(req, res) {
      res.send(users[req.params.id].personal_stories[req.params.file])
    })

    //Create a new story
    app.post('/:id/stories/:file', function(req, res) {
      var id = req.params.id
      var fileName = req.params.file
      var file = req.body.file
      users[id].personal_stories[fileName] = {}
      users[id].personal_stories[fileName].story = []
      users[id].personal_stories[fileName].story.push(file)
      users[id].personal_story_descriptors.push(fileName)
      //send to all subscribers
      res.end()
    })

    //Add to an existing story
    app.put('/:id/stories/:file', function(req, res) {
      var id = req.params.id
      var fileName = req.params.file
      var addition = req.body.addition
      users[id].personal_stories[fileName].story.push(addition)
      res.end()
    })

    //Notifies the user of a new story from a subscriber
    app.post('/:id/update', function(req, res) {

    })

    //Add a subscriptions (used in browser)
    app.post('/subscribe', function(req, res) {
      var body = config
      body.id = req.body.id
      request.post({
          url: req.body.url,
          form: config
        }, function(err, response){
        res.end()
      })
    })

    //Add user as a subscription
    app.post('/:id/subscribe', function(req, res) {
      var url = "http://" + req.ip.substring(7, req.ip.length)
      url += ':' + req.body.port + '/' + req.body.id + '/update'
      var id = req.params.id
      users[id].subscriptions.push(url)
      res.end()
    })

    app.listen(config.port, function () {
      console.log('Example app listening on port',config.port + '!')
    })

}
