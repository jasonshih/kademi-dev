function initManagePointsSystems() {
    flog("initManagePointsSystems");
    initController();
    $("#manageReward .Add").click(function() {
        showAddReward(this);
    });
    $("#manageReward form.addReward").forms({
        callback: function(resp) {
            flog("done");
            window.location.href = resp.nextHref;
        }
    });
}


function initController() {
    //Bind event for Delete reward
    $("body").on("click", "a.DeleteReward", function(e) {
        e.preventDefault();
        var link = $(e.target).closest("a");
        var href = link.attr("href");

        confirmDelete(href, href, function() {
            flog("remove it");
            link.closest("tr").remove();
            link.closest("li").remove();
            Msg.success('Reward is deleted!');
        });
    });
}

function initGroupEditing() {
    $("#modalGroup input[type=checkbox]").click(function() {
        var $chk = $(this);
        flog("checkbox click", $chk, $chk.is(":checked"));
        var isRecip = $chk.is(":checked");
        setGroupRecipient($chk.attr("name"), isRecip);
    });
}

function setGroupRecipient(name, isRecip) {
    flog("setGroupRecipient", name, isRecip);
    try {
        $.ajax({
            type: 'POST',
            url: window.location.pathname,
            data: {
                group: name,
                isRecip: isRecip
            },
            dataType: "json",
            success: function(data) {
                if (data.status) {
                    flog("saved ok", data);
                    if (isRecip) {
                        $(".GroupList").append('<button class="btn btn-sm btn-default reset-margin-bottom" type="button" style="margin-right: 5px;">' + name + '</button>');
                        flog("appended to", $(".GroupList"));
                    } else {
                        var toRemove = $(".GroupList button").filter(function() {
                            return $(this).text() == name;
                        });
                        toRemove.remove();
                    }
                } else {
                    flog("error", data);
                    Msg.error("Sorry, couldnt save " + data);
                }
            },
            error: function(resp) {
                flog("error", resp);
                Msg.error("Sorry, couldnt save - " + resp);
            }
        });
    } catch (e) {
        flog("exception in createJob", e);
    }
}
