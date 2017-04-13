$(document).ready(function(){

    var create_char_field = $('#character-maker');
    var create_char_button = $('#create-character');
    var tags_box = $('#characters-box')
    create_char_button.click(function(ev){
        var val = create_char_field.val();
        console.log("Character name:",val);
        var x_btn = $('<button class="btn btn-danger>');
        x_btn.val('X');
        console.log("Button:",x_btn);
        var tagg = $('<span class="badge badge-primary">');
        tagg.val(val);
        tagg.append(x_btn);
        tags_box.append(tagg);
        create_char_field.val("");
    });
});
