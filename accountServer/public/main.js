$(document).ready(function(){

    var storyContainer = $('#story');
    var createNewStoryButton = $('#create-button');

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

    function buildNewStory(){
        storyContainer.empty();
        var storyBox = $('<div>');
        storyBox.addClass("story-box");
        storyBox.addClass("padded");

        var title = $("<h1>Title: <input id='storyTitle' type='text' placeholder='My Awesome Story' class='darkField titleBox'></input></h1>");
        storyBox.append(title);

        var textArea = $("<h1>Prompt:</h1><textarea id='storyText' style='width: 100%' rows='3' class='darkField' placeholder='It all started when...'></textarea>");
        storyBox.append(textArea);

        var saveButton = $('<button>Save</button>')
        saveButton.addClass('btn btn-green')
        saveButton.on('click',function(){
            let titleText = $('#storyTitle').val();
            let storyText = $('#storyText').val();
            let data = {title:titleText, story:storyText, author:"Insert ID here"}
            console.log("Now Saving Story:",data);
        });
        storyBox.append(saveButton);

        storyContainer.append(storyBox);
    }

    createNewStoryButton.on('click',buildNewStory);


});
