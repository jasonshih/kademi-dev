function initManageAuction() {
    initForms();
    initGroupModal();
    initDateTimePickers();
    initOrgSearch();
    initOrgListBtn();
    initHtmlEditors();
    initImageUploaderViewer();
    initPictureCheckbox();
}

function getImageId(pathname) {
    return pathname.substr(pathname.lastIndexOf('/') + 1);
}

function initPictureCheckbox() {
    $(".mk-default input[type=checkbox]").click(function () {
        var $chk = $(this);
        var isRecip = $chk.is(":checked");
        flog("checkbox click", $chk, isRecip);
        setImageDefault($chk, isRecip);
    });
}

function setImageDefault(chk, isRecip) {
    flog("setImageDefault", chk.attr("name"), isRecip);
    try {
        $.ajax({
            type: 'POST',
            url: chk.attr("name").substr(0, chk.attr("name").lastIndexOf('/') + 1),
            data: {
                imageDefault: true,
                imageID: getImageId(chk.attr("name")),
                isRecip: isRecip
            },
            dataType: "json",
            success: function (data) {
                if (data.status) {
                    flog("saved ok", data);
                    $("#product-images").reloadFragment({
                        whenComplete: function () {
                            initPictureCheckbox();
                        }
                    });
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

function initForms() {
    $(".Cancel").click(function () {
        window.location = "../";
    });
    $("form").forms({
        callback: function (resp) {
            flog("done", resp);
            Msg.success("Saved ok");
        },
        error: function () {
            Msg.error("Some information is not valid. Please check the reward details");
        }
    });
}

function initGroupModal() {
    $("#modalGroup input[type=checkbox]").click(function () {
        var $chk = $(this);
        flog("checkbox click", $chk, $chk.is(":checked"));
        var isRecip = $chk.is(":checked");
        setGroupRecipient($chk.attr("name"), isRecip);
    });
}

function initDateTimePickers() {
    var date = new Date();
    date.setDate(date.getDate() - 1);

    $('.date-time').datetimepicker({
        format: "DD/MM/YYYY HH:mm",
        startDate: date
    });
}

function initOrgSearch() {
    var orgTitle = $('#orgTitle');
    var orgId = $('#orgId');
    var orgSearch = $('#org-search');

    flog("initOrgSearch", orgTitle);
    orgTitle.on("focus click", function () {
        orgSearch.show();
        flog("show", orgSearch);
    });
    orgTitle.keyup(function () {
        typewatch(function () {
            flog("do search");
            doOrgSearch();
        }, 500);
    });
    $("#modalOrganisations").on("show", function () {
        doOrgSearch();
    });
}

function initOrgSearchCheckbox() {
    $("#org-search input[type=checkbox]").click(function () {
        var $chk = $(this);
        var isRecip = $chk.is(":checked");
        flog("checkbox click", $chk, isRecip);
        setOrgRecipient($chk.attr("id"), $chk.attr("name"), isRecip);
    });
}

function initOrgListBtn() {
    $("#OrganisationList a").click(function (e) {
        e.preventDefault();
        var href = $(e.currentTarget).attr("href");
        var name = $(e.currentTarget).attr("name");
        flog("remove organisation", e);
        if (confirm("Are you sure you want to delete " + name + "?")) {
            setOrgRecipient(href, name, false);
        }
    });
}

function doOrgSearch() {
    $.ajax({
        type: 'GET',
        url: window.location.pathname + "?orgSearch=" + $("#orgTitle").val(),
        success: function (data) {
            flog("success", data);

            var $fragment = $(data).find("#org-search");
            $("#org-search").replaceWith($fragment);
            $fragment.show();
            flog("frag", $fragment);
            initOrgSearchCheckbox();
        },
        error: function (resp) {
            Msg.error("An error occurred searching for organisations");
        }
    });
}

function setGroupRecipient(name, isRecip) {
    flog("setGroupRecipient", name, isRecip);
    try {
        $.ajax({
            type: 'POST',
            url: window.location.pathname,
            data: {
                groupName: name,
                isRecip: isRecip
            },
            dataType: "json",
            success: function (data) {
                if (data.status) {
                    flog("saved ok", data);
                    if (isRecip) {
                        $(".GroupList").append('<button class="btn btn-sm btn-default reset-margin-bottom" type="button" style="margin-right: 5px;">' + name + '</button>');
                        flog("appended to", $(".GroupList"));
                    } else {
                        var toRemove = $(".GroupList button").filter(function () {
                            return $(this).text() == name;
                        });
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

function setOrgRecipient(orgId, orgFormattedName, isRecip) {
    flog("setOrgRecipient", orgId, isRecip);
    try {
        $.ajax({
            type: 'POST',
            url: window.location.pathname,
            data: {
                orgId: orgId,
                isRecip: isRecip
            },
            dataType: "json",
            success: function (data) {
                if (data.status) {
                    flog("saved ok", data);
                    if (isRecip) {
                        $(".OrganisationList").append('<div class="btn btn-sm btn-default"><span> ' + orgFormattedName + ' </span><a href="' + orgId + '" name="' + orgFormattedName + '" class="btn btn-xs btn-danger" title="Delete"><i class="fa fa-times"></i></a></div>');
                        flog("appended to", $(".OrganisationList"));
                        $("#OrganisationList a[href='" + orgId + "']").click(function (e) {
                            e.preventDefault();
                            var href = $(e.currentTarget).attr("href");
                            var name = $(e.currentTarget).attr("name");
                            flog("remove organisation", e);
                            if (confirm("Are you sure you want to delete " + name + "?")) {
                                setOrgRecipient(href, name, false);
                            }
                        });
                    } else {
                        var toRemove = $(".OrganisationList div").filter(function () {
                            return $(this).children("a").attr("name") == orgFormattedName;
                        });
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

function initImageUploaderViewer() {
    $('#btn-change-ava').upcropImage({
        buttonContinueText: 'Save',
        url: window.location.pathname, // this is actually the default value anyway
        onCropComplete: function (resp) {
            flog("onCropComplete:", resp, resp.nextHref);
            Msg.info("Done");
            $("#product-images").reloadFragment({
                whenComplete: function () {
                    initPictureCheckbox();
                }
            });
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
                        Msg.info("Done");
                        $("#product-images").reloadFragment({
                            whenComplete: function () {
                                initPictureCheckbox();
                            }
                        });
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

    $("#product-images").on("click", ".del-image", function (e) {
        e.preventDefault();
        var target = $(e.target).closest("a");
        var href = target.attr("href");
        var name = getFileName(href);
        confirmDelete(href, name, function () {
            target.closest(".product-image-thumb").remove();
        });
    });
}