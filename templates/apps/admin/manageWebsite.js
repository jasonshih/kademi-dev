function initManageWebsite() {
    flog("initManageWebsite");
    initGroupCheckbox();
    initApps();
    initManageMenu();
}

function initGroupCheckbox() {
    $("#modalGroup input[type=checkbox]").click(function () {
        var $chk = $(this);
        log("checkbox click", $chk, $chk.is(":checked"));
        var isRecip = $chk.is(":checked");
        setGroupRecipient($chk.attr("name"), isRecip);
    });
}

function setGroupRecipient(name, isRecip) {
    log("setGroupRecipient", name, isRecip);
    try {
        $.ajax({
            type: 'POST',
            url: window.location.pathname,
            data: {
                group: name,
                isRecip: isRecip
            },
            dataType: "json",
            success: function (data) {
                if (data.status) {
                    log("saved ok", data);
                    $("#group-list").reloadFragment();
//                    if (isRecip) {
//                        $(".GroupList").append("<div class=\"alert alert-block alert-info\"><span class=\"fa fa-users\"></span>" + name + "</div>");
//                        log("appended to", $(".GroupList"));
//                    } else {
//                        var toRemove = $(".GroupList div").filter(function () {                            
//                            var thisName = $(this).find("a").text();
//                            flog("filter", this, thisName);
//                            return thisName === name;
//                        });
//                        flog("remove", toRemove);
//                        toRemove.remove();
//                    }
                } else {
                    log("error", data);
                    Msg.error("Sorry, couldnt save " + data);
                }
            },
            error: function (resp) {
                log("error", resp);
                Msg.error("Sorry, couldnt save - " + resp);
            }
        });
    } catch (e) {
        log("exception in createJob", e);
    }
}