function initProfile() {
    flog("initProfile - profile.js");
    initProfileLoginAs();
    initOrgSearch();
    initNewMembershipForm();
    $(".initProfileForm").forms({
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

    $(".memberships-wrapper").on("click", ".addGroup a", function (e) {
        flog("click", this);
        e.preventDefault();
        e.stopPropagation();
        var groupName = $(e.target).closest("a").attr("href");
        doAddToGroup(groupName);
    });


    $(".form-unsubscribe").forms({
        validate: function () {
            return confirm("Are you sure you want to unsubscribe this user? They will no longer be able to access this site");
        },
        callback: function (resp, form) {
            Msg.info("Unsubscribed. Now going to manage users page");
            window.location = "/manageUsers";
        },
        confirmMessage: "The user has been unsubscribed"
    });

    jQuery("abbr.timeago").timeago();
    $('#btn-change-ava').upcropImage({
        buttonContinueText: 'Save',
        url: window.location.pathname, // this is actually the default value anyway
        onCropComplete: function (resp) {
            flog("onCropComplete:", resp, resp.nextHref);
            $(".profile-photo img").attr("src", resp.nextHref);
        },
        onContinue: function (resp) {
            flog("onContinue:", resp, resp.result.nextHref);
            $.ajax({
                url: window.location.pathname,
                type: 'POST',
                dataType: 'json',
                data: {
                    uploadedHref: resp.result.nextHref,
                    applyImage: true
                },
                success: function (resp) {
                    if (resp.status) {
                        $(".profile-photo img").attr("src", resp.nextHref);
                        $(".main-profile-photo img").attr("src", resp.nextHref);
                    } else {
                        alert("Sorry, an error occured updating your profile image");
                    }
                },
                error: function () {
                    alert('Sorry, we couldn\'t save your profile image.');
                }
            });
        }
    });

    $('body').on('click', '#btn-remove-ava', function (e) {
        e.preventDefault();

        if (confirm('Are you sure you want to clear the avatar?')) {
            $.ajax({
                url: window.location.pathname,
                type: 'POST',
                dataType: 'json',
                data: {
                    clearAvatar: true
                },
                success: function (resp) {
                    if (resp.status) {
                        $(".profile-photo img").attr("src", "pic");
                        $(".main-profile-photo img").attr("src", "pic");
                    } else {
                        alert("Sorry, an error occured updating your profile image");
                    }
                },
                error: function () {
                    alert('Sorry, we couldn\'t save your profile image.');
                }
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
    $("#membershipsContainer").reloadFragment();
}


function initProfileLoginAs() {
    flog("initLoginAs");
    $("body").on("click", ".btn-login-as", function (e) {
        e.preventDefault();
        flog("login as");
        showLoginAs(""); // on the current page
    });
}

function doAddToGroup(groupName) {
    $.ajax({
        url: window.location.pathname,
        type: 'POST',
        data: {
            group: groupName
        },
        success: function (resp) {
            if (resp.status) {
                reloadMemberships();
            } else {
                Msg.error("Couldnt add group: " + resp.messages);
            }
        },
        error: function (e) {
            Msg.error(e.status + ': ' + e.statusText);
            hideLoadingIcon();
        }
    })

}