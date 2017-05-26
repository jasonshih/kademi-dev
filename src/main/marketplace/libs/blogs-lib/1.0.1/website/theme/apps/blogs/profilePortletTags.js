$(function(){
    var form = $(".tags-form");
    form.find("input[type=checkbox]").change(function(e){
        var chk = $(e.target);
        var tagName = chk.attr("name");
        var b = chk.prop('checked');
        flog("changed", b, tagName);
        form.submit();
    });
});