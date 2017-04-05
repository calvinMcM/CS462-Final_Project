$(document).ready(function(){

    var create_tag_field = $('#tag-maker');
    var create_tag_button = $('#create-tag');
    var tags_box = $('#tags-box')
    create_tag_button.click(function(ev){
        var val = create_tag_field.val();
        var x_btn = $('<button class="btn btn-danger>');
        x_btn.val('X');
        var tagg = $('<span class="badge badge-primary">');
        tagg.val(val);
        tagg.append(x_btn);
        tags_box.append(tagg);
        create_tag_field.val("");
    });
});
