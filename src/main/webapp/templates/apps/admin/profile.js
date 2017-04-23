function initProfile() {
    flog("initProfile - profile.js");
    initProfileLoginAs();
    initOrgSearch();
    initNewMembershipForm();
    initEnableDisable();
    initTabLazyLoading();
    $(".initProfileForm").forms({
        callback: function (resp, form) {
            Msg.info("Done");
            $('#pwdState').reloadFragment();
        }
    });

    flog("init delete membersip");
    $(".memberships-wrapper").on("click", "a.btn-delete-membership", function (e) {
        flog("click", this);
        e.preventDefault();
        e.stopPropagation();
        if (confirm("Are you sure you want to delete this group membership?")) {
            var a = $(this);
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


    $(".form-unsubscribe button").on('click', function(e){
        e.preventDefault();
        var c = confirm("Are you sure you want to unsubscribe this user? They will no longer be able to access this site");
        if (c){
            $(".form-unsubscribe").trigger('submit');
        }
    });

    $(".form-unsubscribe").forms({
        callback: function (resp, form) {
            Msg.info("Unsubscribed. Now going to manage users page");
            window.location = "/manageUsers";
        },
        confirmMessage: "The user has been unsubscribed"
    });

    jQuery("abbr.timeago").timeago();
    
    $('#btn-change-ava').upcropImage({
        buttonContinueText: 'Save',
        isCameraEnabled: true,
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

function initTabLazyLoading() {
    $(document).on('shown.bs.tab', function (e) {
        var id = $(e.target).attr("href");
        if (id) {
            var tab = $(id);
            flog("shown", id, tab);
            var tabId = id.substring(1);
            loadTab(tabId);
        }
    });

    $(document).on('pageDateChanged', function (e, startDate, endDate) {
        flog("page date changed", startDate, endDate);
        reloadActiveTab();
    });    


    // Better load the current tab if one is selected
    var uri = URI(window.location);
    var tabId = uri.fragment();
    // Need to strip off the -tab suffix
    tabId = tabId.substring(0, tabId.length - 4);

    loadTab(tabId);
}

function loadTab(tabId) {
    var tab = $("#" + tabId + ".lazy-load");
    flog("selected tab", tab, tabId);
    if (tab.length > 0) {
        tab.reloadFragment({
            url: window.location.pathname + "?showTab=" + tabId,
            whenComplete: function () {
                $("abbr.timeago").timeago();
            }
        });
    }
}

function reloadActiveTab() {
    var tab = $(".lazy-load.active");
    if (tab.length > 0) {
        var tabId = tab.attr("id");
        tab.reloadFragment({
            url: window.location.pathname + "?showTab=" + tabId,
            whenComplete: function () {
                $("abbr.timeago").timeago();
            }
        });
    }    
}

function initEnableDisable() {
    $("body").on("click", ".profileDisable", function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (confirm("Are you sure you want to disable this profile? This will remove the profile from user lists, but it can be re-enabled later")) {
            setProfileEnabled(window.location.href, false);
        }
    });
    $("body").on("click", ".profileEnable", function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (confirm("Are you sure you want to enable this profile? This will include the profile in user lists")) {
            setProfileEnabled(window.location.href, true);
        }
    });

}

function setProfileEnabled(profileHref, enabled) {
    $.ajax({
        url: profileHref,
        type: 'POST',
        data: {
            enabled: enabled
        },
        success: function (resp) {
            if (resp.status) {
                window.location.reload();
            } else {
                Msg.error("Couldnt change enabled status: " + resp.messages);
            }
        },
        error: function (e) {
            Msg.error(e.status + ': ' + e.statusText);
            hideLoadingIcon();
        }
    })
}

function initNewMembershipForm() {
    $("body").on("click", ".btn-add-group", function (e) {
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