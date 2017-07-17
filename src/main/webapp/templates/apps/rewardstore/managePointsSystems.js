function initManagePointsSystems() {
    flog("initManagePointsSystems");
    initController();
    $("#manageReward .Add").click(function () {
        showAddReward(this);
    });
    $("#manageReward form.addReward").forms({
        onSuccess: function (resp) {
            flog("done");
            window.location.href = resp.nextHref;
        }
    });
}


function initController() {
    //Bind event for Delete reward
    $("body").on("click", "a.DeleteReward", function (e) {
        e.preventDefault();
        var link = $(e.target).closest("a");
        var href = link.attr("href");

        confirmDelete(href, href, function () {
            flog("remove it");
            link.closest("tr").remove();
            link.closest("li").remove();
            Msg.success('Reward is deleted!');
        });
    });
}

function initGroupEditing() {
    $("#modalGroup input[type=checkbox]").click(function () {
        var $chk = $(this);
        flog("checkbox click", $chk, $chk.is(":checked"));
        var isRecip = $chk.is(":checked");
        var groupType = $chk.closest('label').data("grouptype");
        setGroupRecipient($chk.attr("name"), groupType, isRecip);
    });
}

function setGroupRecipient(name, groupType, isRecip) {
    flog("setGroupRecipient", name, groupType, isRecip);
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
                    flog("saved ok", data);
                    if (isRecip) {
                        var groupClass = "";
                        var groupIcon = "";
                        if (groupType === "P" || groupType === "") {
                            groupClass = "alert alert-success";
                            groupIcon = "clip-users";
                        } else if (groupType === "S") {
                            groupClass = "alert alert-info";
                            groupIcon = "fa fa-trophy";
                        } else if (groupType === "M") {
                            groupClass = "alert alert-info";
                            groupIcon = "fa fa-envelope";
                        }
                        var newBtn = $('<span id="group_' + name + '" class="group-list ' + groupClass + '">'
                            + '<i class="' + groupIcon + '"></i>'
                            + '<span class="block-name" title="' + name + '"> ' + name + '</span>'
                            + ' <a href="' + name + '" class="btn btn-xs btn-danger btn-remove-group" title="Delete access for group ' + name + '"><i class="fa fa-times"></i></a>'
                            + '</span>');
                        $(".GroupList").append(newBtn);
                        flog("appended to", $(".GroupList"));
                    } else {
                        var toRemove = $("#group_" + name);
                        toRemove.remove();
                    }
                } else {
                    flog("error", data);
                    Msg.error("Sorry, couldnt save " + data);
                }
            },
            error: function (resp) {
                flog("error", resp);
                Msg.error("Sorry, couldnt save - " + resp);
            }
        });
    } catch (e) {
        flog("exception in createJob", e);
    }
}

function initExpireAllPoints() {
    $('body').on('click', '.btnExpireAll', function (e) {
        e.preventDefault();
        if (confirm("Are you sure you want to expire all records? This can not be undone! All points records in this points system will be marked as expired and not available for redemptions.")) {
            $.ajax({
                type: 'POST',
                data: {
                    expireAll: true
                },
                dataType: "json",
                url: "",
                success: function (data) {
                    flog("success", data);
                    if (data.status) {
                        $('#tablePointsBody').reloadFragment();
                        Msg.success("All points have been expired");
                    } else {
                        Msg.error("There was a problem expiring points. Please try again and contact the administrator if you still have problems");
                    }
                },
                error: function (resp) {
                    Msg.error("An error occurred removing points. You might not have permission to do this");
                }
            });
        }
    });
}

