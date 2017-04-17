function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  var userInfo = {"username": profile.getEmail(), "userId": profile.getId()}

  // Session storage set
  sessionStorage.setItem("StoryTimeID",profile.getId());
  console.log("google waiting for response....")
  $.post('googleCallback', userInfo, function(data) {
    console.log("got response from app server")
      // Should check for 400's...
    window.location = data.url
  })
}
