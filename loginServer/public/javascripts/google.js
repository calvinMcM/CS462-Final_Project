function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  var userInfo = {"username": profile.getEmail(), "userId": profile.getId()}

  // Session storage set
  sessionStorage.setItem("StoryTimeID",profile.getId());
  console.log("google waiting for response....")
  $.post('googleCallback', userInfo, function(data) {
    console.log("redirecting to: ", data.url)
    window.location = data.url
  })
}
