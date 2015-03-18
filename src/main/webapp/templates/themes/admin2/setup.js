$(function() {
    initCreateWebsite();
    initPlaceHolderForDateTime();
});

function initCreateWebsite() {
    flog("initCreateWebsite");
    $(".createWebsite").click(function() {
        flog("click createWebsite", myPrompt);
        myPrompt("createWebsite", "websites/", "Create website", "Enter a short identifier (not the domain name) for the website." ,"Enter a name","newName", "Create", "simpleChars", "Enter a simple name for the website, eg myweb", function(newName, form) {
            flog("create website", newName, form);
            postForm(form, ".pageMessage", "Please enter a valid name", function() {
                closeMyPrompt();
                window.location.reload();
            });
            return false;
        });
    });
}

function initPlaceHolderForDateTime() {
    flog("initPlaceHolderForDateTime");
    $("input.DateTime").each(function() {
        var _this = $(this);
        
        _this.datetimepicker({
            dateFormat: "dd/mm/yy",
            stepMinute: 10
        });
        flog("datepicker", _this.closest(".input-group").find(".input-group-addon"));
        _this.closest(".input-group").find(".input-group-addon").click(function() {
            flog("trigger");
            _this.trigger("focus");
        });
        flog("datepicker", _this);
    });
}
