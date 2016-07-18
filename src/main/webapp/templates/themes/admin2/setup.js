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
    var format = "D/M/YYYY";    
    
    $("input.DateTime").each(function() {        
        var _this = $(this);
        flog("initPlaceHolderForDateTime", format, _this);
        
        _this.datetimepicker({
            format : format
        });
//        _this.after(
//                $('<img src="/static/common/icon_calendar.png" alt="" width="21" height="24" class="DateTimeIcon" />')
//                .bind("click", function(e) {
//                    e.preventDefault();
//                    _this.trigger("focus");
//                })
//        );
        log("datepicker", _this);
    });
}

