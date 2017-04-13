function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  var userInfo = {"username": profile.getEmail(), "userId": profile.getId()}
  console.log(userInfo)
  $.post('googleCallback', userInfo, function(data) {
    console.log("Data sent")
  })
}
