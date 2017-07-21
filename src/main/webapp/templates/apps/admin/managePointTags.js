function initManagePointTags() {
    initForms();
    initClickableRow();
    initSelectAll();
    initRemoveTags();
}

function initForms() {
    var modal = $("#modal-new-tag");
    $('#new-tag-form').forms({
        onSuccess: function (resp) {
            flog("done new tag", resp);
            if (resp.nextHref) {
                window.location.href = resp.nextHref;
            } else {
                Msg.info($('#new-tag-form').find('[name=newTag]').val() + ' Added');
                $("#point-tag-div").reloadFragment({
                    whenComplete: function () {
                        initSelectAll();
                        initClickableRow();
                    }
                });
                $('#new-tag-form').trigger("reset");
            }
            modal.modal('hide');
        }
    });
}

function initClickableRow() {
    $('.clickableRow').on('click', function (e) {
        e.preventDefault();
        var t = $(e.currentTarget);
        var href = t.find("a").attr("href");
        window.location.href = href;
    });
}

function initRemoveTags() {
    $('.removeTags').on('click', function (e) {
        e.preventDefault();
        var node = $(e.target);
        log("removeUsers", node, node.is(":checked"));
        var checkBoxes = node.closest(".Content").find("tbody td input[name=toRemoveId]:checked");
        if (checkBoxes.length == 0) {
            Msg.error("Please select the tags you want to remove by clicking the checkboxs to the right");
        } else {
            Kalert.confirm("Are you sure you want to remove " + checkBoxes.length + " points tags?", function () {
                doRemovePoints(checkBoxes);
            });
        }
    });
}

function doRemovePoints(checkBoxes) {
    $.ajax({
        type: 'POST',
        data: checkBoxes,
        dataType: "json",
        url: ".",
        success: function (data) {
            log("success", data)
            if (data.status) {
                Msg.success("Removed points tags");
                window.location.reload();
            } else {
                Msg.error("There was a problem removing points tags. Please try again and contact the administrator if you still have problems");
            }
        },
        error: function (resp) {
            Msg.error("An error occurred removing tags. You might not have permission to do this");
        }
    });
}