function initProfile() {
    flog("initProfile - profile.js");
    initProfileLoginAs();
    initOrgSearch();
    initNewMembershipForm();
    $("form").not("#modal-membership form").forms({
        callback: function (resp, form) {
            Msg.info("Done");
        }
    });

    $("#myUploaded").mupload({
        url: "",
        buttonText: "<i class=\"fa fa-folder-open-o\"></i> Select a new photo",
        oncomplete: function (data, name, href) {
            flog("set img", $(".profile-photo img"));
            $(".profile-photo img").attr("src", "pic");
        }
    });

    flog("init delete membersip");
    $(".memberships-wrapper").on("click", "a.btn-delete-membership", function (e) {
        flog("click", this);
        e.preventDefault();
        e.stopPropagation();
        if (confirm("Are you sure you want to delete this group membership? WARNING: If this is the last membership you will not be able to edit the user.")) {
            var a = $(e.target);
            if (!a) {
                a = a.parent();
            }
            flog("do it", a);
            var href = a.attr("href");
            deleteFile(href, function () {
                a.closest("span.membership").remove();
            });
        }
    });
}

function initNewMembershipForm() {
    $(".btn-add-group").click(function (e) {
        e.preventDefault();
        e.stopPropagation();
        $("#modal-membership").modal('show');
    });

    $("#modal-membership").find("form").forms({
        callback: function (resp) {
            flog("done new membership", resp);
            $("#modal-membership").modal('hide');
            reloadMemberships();
            Msg.info("Saved membership");
        }
    });
}

function reloadMemberships() {
    $.ajax({
        type: 'GET',
        url: window.location.pathname,
        success: function (data) {
            flog("success", data);
            var $fragment = $(data).find("#user-membership");
            var orig = $("#user-membership");
            flog("replace", orig, $fragment);
            orig.replaceWith($fragment);
        },
        error: function (resp) {
            Msg.error("error: " + resp);
        }
    });
}


function initProfileLoginAs() {
    flog("initLoginAs");
    $("body").on("click", ".btn-login-as", function (e) {
        e.preventDefault();
        flog("login as");
        showLoginAs(""); // on the current page
    });
}
