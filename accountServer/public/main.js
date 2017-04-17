$(document).ready(function(){

    var storyContainer = $('#story');
    var createNewStoryButton = $('#create-button');
    var descriptorsList = $('#descriptorsList');

    var storytimeid = sessionStorage.getItem("storytimeid");
    if(!storytimeid){
        // window.location.href = "http://ec2-34-208-82-175.us-west-2.compute.amazonaws.com:3000/";
        storytimeid = "testID";
    }

    function buildStory(story, desc, element){

        console.log("Building Story");
        storyContainer.empty();
        var storyBox = $('<div>');
        storyBox.addClass("story-box");
        storyBox.addClass("padded");

        var title = $("<h1>"+story.title+"</h1>");
        storyBox.append(title);

        for(var s of story.story){
            storyBox.append($("<div class='darkField storyLine'>"+s+"<h4></h4></div>"))
        }

        var textAdd = $("<h1>Next Line:</h1><textarea id='storyAdd' style='width: 100%' rows='3' class='darkField' placeholder='All of the sudden...'></textarea>");
        storyBox.append(textAdd);

        var saveButton = $('<button>Add</button>')
        saveButton.addClass('btn btn-green')
        saveButton.on('click',function(){
            var addition = $('#storyAdd').val();
            console.log("Making Addition:",addition);
            $.ajax({
                method:"PUT",
                url: desc.url,
                data:{addition:addition}
            }).done(function(response){
                console.log("Story Added to!");
                setTimeout(function(){ element.click(); },1000);
            });
        });
        storyBox.append(saveButton);

        storyContainer.append(storyBox);
    }

    function populateDescriptors(descriptors){
        clearDescriptors();
        for(let id in descriptors){
            for(let storyDesc of descriptors[id]){
                console.log("Descriptor:",storyDesc);
                var frame = $("<li id='" + storyDesc.title + "' class='list-group-item storyDescriptor'>" + storyDesc.title + "<span class='sd-author'> | " + storyDesc.author + "</span></li>");
                frame.on('click',function(){
                    $.get(storyDesc.url,{},function(res){
                        console.log("Retrieved story:",res);
                        buildStory(res,storyDesc,frame);
                    })
                })
                descriptorsList.append(frame);
            }
        }
    }

    function getAllStoryDescriptors(){
        $.get(storytimeid + "/stories/",null,function(response){
            console.log("Story Descriptors:",response);
            populateDescriptors(response);
        })
    }

    function pollServer(){

    }

    function clearStoryArea(){
        storyContainer.empty();
    }

    function clearDescriptors(){
        descriptorsList.empty();
    }

    function getFriendsList(){
        $.get("users",null,function(response){
            console.log("FriendsList:",response);
        })
    }

    $('#subscribe-button').on("click",getFriendsList);

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
            let file = {file:{title:titleText, story:[storyText], author: storytimeid}}

            console.log("Now Saving Story:",fileName);
            $.post(storytimeid + "/stories/" + fileName, file, function(response){
                clearStoryArea();
                getAllStoryDescriptors();
            })
        });
        storyBox.append(saveButton);

        storyContainer.append(storyBox);
    }

    createNewStoryButton.on('click',buildNewStory);


    // Final setup
    getAllStoryDescriptors();
});
