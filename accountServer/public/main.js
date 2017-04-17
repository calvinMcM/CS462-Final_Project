$(document).ready(function(){

    var storyContainer = $('#story');
    var createNewStoryButton = $('#create-button');

    var storytimeid = sessionStorage.getItem("storytimeid");
    if(!storytimeid){
        // window.location.href = "http://ec2-34-208-82-175.us-west-2.compute.amazonaws.com:3000/";
        storytimeid = "testID";
    }

    function buildStory(){

        let story = {
            title: "Jack And Jill",
            author: "Jane",
            story:[
                "Jack and Jill went up a hill",
                "to fetch a pail of water",
                "Jack fell down",
                "And broke his crown",
                "And Jill came tumbling after!"
            ]
        }

        storyContainer.empty();
        var storyBox = $('<div>');
        storyBox.addClass("story-box");
        storyBox.addClass("padded");

        var title = $("<h1>"+story.title+"</h1>");
        storyBox.append(title);

        for(var s of story.story){
            storyBox.append($("<div class='darkField storyLine'>"+s+"<h4></h4></div>"))
        }

        var textArea = $("<h1>Next Line:</h1><textarea id='storyText' style='width: 100%' rows='3' class='darkField' placeholder='All of the sudden...'></textarea>");
        storyBox.append(textArea);

        var saveButton = $('<button>Save</button>')
        saveButton.addClass('btn btn-green')
        saveButton.on('click',function(){
            story.story.push(textArea.val())
            console.log("Now Saving Contribution Story:",data);
        });
        storyBox.append(saveButton);

        storyContainer.append(storyBox);
    }
    $(".storyDescriptor").on('click',buildStory);

    function populateDescriptors(descriptors){
        for(var d of descriptors){
            var frame = $("<li id='" + d.id + "' class='list-group-item storyDescriptor'>");


        }
    }

    function getAllStories(){
        $.get(storytimeid + "/stories/",null,function(response){

        })
    }

    function pollServer(){

    }

    function clearStoryArea(){
        storyContainer.empty();
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
            let fileName = titleText.replace(" ","") + ".txt";
            let storyText = $('#storyText').val();
            let file = {title:titleText, story:[storyText], author:"Insert ID here"}

            console.log("Now Saving Story:",fileName);
            $.post(storytimeid + "/stories/" + fileName, file, function(response){
                console.log("Save response:",response);
                clearStoryArea();
            })
        });
        storyBox.append(saveButton);

        storyContainer.append(storyBox);
    }

    createNewStoryButton.on('click',buildNewStory);


});
