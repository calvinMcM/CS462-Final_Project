function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  $.post('googleCallback', profile, function(data) {
    console.log("Data sent")
  })
}
