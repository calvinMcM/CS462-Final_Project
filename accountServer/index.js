var express = require('express');
var app = express();
var request = require('request');

//Parse request body in JSON form
var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set up public routes
app.use(express.static('public'));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

// File System
const fs = require('fs');

//URL to the login/registry server
var registry = "http://ec2-34-208-82-175.us-west-2.compute.amazonaws.com:3000"

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

//Register the application server with the registry
function register(data){
  request.post({
    url: registry + "/registerAppServer",
    form: data
  },function(response){
    run(data);
  })
}

function run(config){

  var users = {
  }

  app.get('/', function (req, res) {
    res.sendFile('views/index.html',{root: __dirname})
  })

  //Adds a user to the app server if they haven't already been added
  app.post('/userLogin', function(req, res) {
    if (!users.hasOwnProperty(req.body._doc._id)) {
      user = {
        "id": req.body._doc._id,
        "username": req.body._doc.username,
        "subscriptions": [],
        "personal_story_descriptors": [],
        "personal_stories": {},
        "subscription_story_descriptors": {}}
      users[req.body._doc._id] = user
    }
    res.send(users[req.body._id])
  })

  //Gets all users from the registry
  app.get('/users', function(req, res) {
    request.get(registry + "/allUsers", function(err, data) {
      res.send(JSON.parse(data.body))
    })
  })

  //Get all story descriptors for a user and the users they subscribe to
  app.get('/:id/stories', function(req, res) {
    var stories = users[req.params.id].subscription_story_descriptors
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
    var file = req.body.file;
    if(!users.hasOwnProperty(id)){
        res.sendStatus(403);
        res.end();
        return;
    }
    users[id].personal_stories[fileName] = file
    var url = "http://" + req.get('host')
    url += '/' + id + '/stories/' + fileName
    var storyObject = {"name": fileName, "url": url, "title":file.title, "author":users[id].username}
    users[id].personal_story_descriptors.push(storyObject)
    res.end()
    var body = {"story_descriptor": fileName, "owner": id, "port": config.port}
    for (subscription of users[id].subscriptions) {
      request.post({
        url: subscription,
        form: body
      })
    }
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
    var id = req.params.id
    var newStory = req.body.story_descriptor
    var subscriber = req.body.owner
    var url = "http://" + req.ip.substring(7, req.ip.length)
    url += ':' + req.body.port + '/' + id + '/stories/' + newStory
    var storyObject = {"name": newStory, "url": url}
    users[id].subscription_story_descriptors[subscriber].push(storyObject)
    res.end()
  })

  //Add a subscriptions (used in browser)
  app.post('/subscribe', function(req, res) {
    console.log("Body:", req.body)
    var body = config
    body.id = req.body.id
    subscriber = req.body.subscriber
    users[body.id].subscription_story_descriptors[subscriber] = []
    res.end()
    console.log("Subscriber ID:", subscriber)
    var urlToHit = req.body.url + '/' + subscriber + '/subscribe'
    console.log("URL to hit:", urlToHit)
    request.post({
      url: urlToHit,
      form: config
    }, function(err, response){
      var stories = JSON.parse(response.body)
      for (story of stories) {
        users[body.id].subscription_story_descriptors[subscriber].push(story)
      }
    })
  })

  //Add user as a subscription
  app.post('/:id/subscribe', function(req, res) {
    var url = "http://" + req.ip.substring(7, req.ip.length)
    url += ':' + req.body.port + '/' + req.body.id + '/update'
    var id = req.params.id
    console.log("ID:", id)
    console.log(users)
    users[id].subscriptions.push(url)
    res.send(users[id].personal_story_descriptors)
  })

  app.listen(config.port, function () {
    console.log('Example app listening on port',config.port + '!')
  })
}
