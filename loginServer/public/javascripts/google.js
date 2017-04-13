function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  var userInfo = {"username": profile.getEmail(), "userId": profile.getId()}
  console.log("data to be sent", userInfo)
  $.post('googleCallback', userInfo, function(data) {
    console.log("Data sent")
    console.log("recieved data", data)
    //set cookie here!!! data.id
    window.location = data.url
  })
}
