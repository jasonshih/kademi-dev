function initProfile() {
    flog("initProfile");
    $("form").not(".form-unsubscribe").forms({
        onSuccess: function(resp, form) {
            flog("done");
        }
    });
    $(".form-unsubscribe").forms({
        validate: function() {
            return confirm("Are you sure you want to unsubscribe? You will no longer be able to access this site");
        },
        onSuccess: function(resp, form) {
            flog("done, now logout");
            doLogout();
        },
        confirmMessage: "You have been unsubscribed"
    });
    
    $("#myModal button.btn-save").click(function(e) {
        e.preventDefault();
        e.stopPropagation();
        $(e.target).closest(".modal").find("form").trigger("submit");
    });
    
    $(".membership-remove").click(function(e) {
        e.preventDefault();
        e.stopPropagation();
        var target = $(e.target).closest("a");
        flog("remove", $("form.memberships"));
        if ($("form.memberships li").length === 1) {
            if (!confirm("WARNING: If you delete this membership you will not be able to access this site. Are you sure you want to delete this membership?")) {
                return;
            }
        }
        var li = target.closest("li");
        flog("deleteMembership", target);
        deleteMembership(li, target.attr("href"));

    });
    
    $("label.optin input").change(function(e) {
        e.preventDefault();
        e.stopPropagation();
        var target = $(e.target);
        updateOptin(target.is(":checked"), target.attr("value"));
    });
}

function deleteMembership(row, id) {
    var form = row.closest("form");
    form.addClass("ajax-processing");
    $.ajax({
        type: 'POST',
        url: window.location.pathname + "?removeMembership=" + id,
        dataType: "json",
        success: function(data) {
            flog("success", data);
            form.removeClass("ajax-processing");
            row.remove();
        },
        error: function(resp, textStatus, errorThrown) {
            form.removeClass("ajax-processing");
            flog("error", resp, textStatus, errorThrown);
            alert("Error deleting the membership");
        }
    });
}
function updateOptin(on, group) {
    var form = $("form.optins");
    form.addClass("ajax-processing");
    $.ajax({
        type: 'POST',
        url: window.location.pathname,
        data: {
            enableOptin: on,
            group: group
        },
        dataType: "json",
        success: function(data) {
            flog("success", data);
            form.removeClass("ajax-processing");
        },
        error: function(resp, textStatus, errorThrown) {
            flog("error", resp, textStatus, errorThrown);
            form.removeClass("ajax-processing");
            Msg.error("Error updating the optin");
        }
    });
}