function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  var userInfo = {"username": profile.getEmail(), "userId": profile.getId()}
  console.log("data to be sent", userInfo)

  // Session storage set
  var ss = Window.sessionstorage;
  ss.setItem("StoryTimeID",profile.getId());

  $.post('googleCallback', userInfo, function(data) {

      // Should check for 400's...
    console.log("Data sent")
    console.log("recieved data", data)
    window.location = data.url
  })
}
