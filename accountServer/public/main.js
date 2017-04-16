$(document).ready(function(){

    var storytimeid = sessionStorage.getItem("StoryTimeID");
    if(!storytimeid){
        // window.location.href = "http://34.208.82.175:3000";
    }

    function populateStories(stories){

    }

    function populateDescriptors(descriptors){
        for(var d of descriptors){
            var frame = $("<li id='" + d.id + "' class='list-group-item storyDescriptor'>");


        }
    }

    function pollServer(){

    }

});
