function initManageUsers() {
    initNewUserForm();
    initSettingPanel();
    initSearchBusiness();
    initSearchUser();
    initOrgSearch();
    initSelectAll();
    initRemoveUsers();
    initAddToGroup();
    initUploadUsers();
    initLoginAs();
}

function initChangeUserId() {
    $(".change-userid").click(function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (confirm("Changing the userID will invalidate the user's password. They will need to reset their password. Are you sure you want to continue?")) {
            var newId = prompt("Please enter a new UserID. This must be unique across all users in this system");
            if (newId) {
                doUpdateUserId(newId);
            }
        }
    });
}

function initRemoveCreds() {
    $('body').on('click', '.btn-remove-creds', function (e) {
        e.preventDefault();
        if (confirm("Are you sure you want to remove this users password and credentials? They will not be able to login.")) {
            doRemoveCreds();
        }
    });
}

function initUploadUsers() {
    var modalUploadCsv = $("#modal-upload-csv");
    $(".btn-upload-users-csv").click(function (e) {
        e.preventDefault();

        modalUploadCsv.modal('show');
    });

    var modalMatchOrgsCsv = $("#modal-match-orgs-csv");
    $(".btn-match-orgs").click(function (e) {
        e.preventDefault();

        modalMatchOrgsCsv.modal('show');
    });

    var resultUploadCsv = modalUploadCsv.find('.upload-results');
    $("#do-upload-csv").mupload({
        buttonText: "<i class=\"clip-folder\"></i> Upload spreadsheet",
        url: "users.csv?insertMode=true",
        useJsonPut: false,
        oncomplete: function (data, name, href) {
            flog("oncomplete:", data.result.data, name, href);
            resultUploadCsv.find('.num-updated').text(data.result.data.numUpdated);
            resultUploadCsv.find('.num-inserted').text(data.result.data.numInserted);
            resultUploadCsv.find('.num-unmatched').text(data.result.data.unmatched.length);
            showUnmatched(resultUploadCsv, data.result.data.unmatched);
            resultUploadCsv.show();
            Msg.success("Upload completed. Please review any unmatched members below, or refresh the page to see the updated list of members");
        }
    });

    var formUploadCsv = modalUploadCsv.find('form');
    $("#allow-inserts").click(function (e) {
        flog("click", e.target);
        if ($(e.target).is(":checked")) {
            formUploadCsv.attr("action", "users.csv?insertMode=true");
            flog("allow insert:", formUploadCsv);
        } else {
            formUploadCsv.attr("action", "users.csv");
            flog("do not allow insert:", formUploadCsv, formUploadCsv.attr("action"));
        }
    });
}

function showUnmatched(resultUploadCsv, unmatched) {
    var unmatchedTable = resultUploadCsv.find("table");
    var tbody = unmatchedTable.find("tbody");
    tbody.html("");
    $.each(unmatched, function (i, row) {
        flog("unmatched", row);
        var tr = $("<tr>");
        $.each(row, function (ii, field) {
            tr.append("<td>" + field + "</td>");
        });
        tbody.append(tr);
    });
}

function initSearchUser() {
    $("#user-query").keyup(function () {
        typewatch(function () {
            flog("do search");
            doSearch();
        }, 500);
    });
    $("#search-group").change(function () {
        doSearch();
    });
}

function doSearch() {
    var query = $("#user-query").val();
    var groupName = $("#search-group").val();
    flog("doSearch", query, groupName);
    $.ajax({
        type: 'GET',
        url: window.location.pathname + "?q=" + query + "&g=" + groupName,
        success: function (data) {
            flog("success", data);
            var $fragment = $(data).find("#table-users-body");
            $("#table-users-body").replaceWith($fragment);
        },
        error: function (resp) {
            Msg.error("An error occured doing the user search. Please check your internet connection and try again");
        }
    });
}

function doUpdateUserId(newUserId) {
    $.ajax({
        type: 'POST',
        url: window.location.pathname,
        dataType: "json",
        data: {
            newUserId: newUserId
        },
        success: function (data) {
            flog("success", data)
            if (data.status) {
                window.location.reload();
            } else {
                Msg.error("Could not change the user's ID: " + data.messages);
            }

        },
        error: function (resp) {
            Msg.error("An error occured attempting to update the userID. Please check your internet connection");
        }
    });
}

function doRemoveCreds() {
    $.ajax({
        type: 'POST',
        url: window.location.pathname,
        dataType: "json",
        data: {
            removeAllCredentials: true
        },
        success: function (data) {
            flog("success", data)
            if (data.status) {
                window.location.reload();
            } else {
                Msg.error("Could not change the user's ID: " + data.messages);
            }

        },
        error: function (resp) {
            Msg.error("An error occured attempting to update the userID. Please check your internet connection");
        }
    });
}

function initSettingPanel() {
    // Check cookie for user settings
    var _SettingContent = $("div.SettingContent"),
            _userSetting = $.cookie("user-setting"),
            _checkboxes = _SettingContent.find("input[type=checkbox]"),
            _remember = $("#remember");

    if (_userSetting) {
        _remember.attr("checked", true);
        _checkboxes.not(_remember).attr("checked", false);
        _userSetting = _userSetting.split("#");
        _SettingContent.find("select").val(_userSetting[0]);
        for (var i = 1, setting; setting = _userSetting[i]; i++) {
            _checkboxes.filter("#" + setting).check(true);
        }
    }

    // Event for save change button
    $("#saveChange").bind("click", function (e) {
        if (_remember.is(":checked")) {
            var setting = [];
            setting.push(_SettingContent.find("select").val());
            _checkboxes
                    .not(_remember)
                    .each(function () {
                        var _self = $(this);
                        if (_self.is(":checked")) {
                            setting.push(_self.val());
                        }
                    });

            $.cookie("user-setting", setting.join("#"), {
                expires: 999
            });
        } else {
            $.cookie("user-setting", null);
        }
        _SettingContent.addClass("Hidden");
        e.preventDefault();
    });
}

function initSearchBusiness() {
    var _container = $("#pullDown");
    var _content = _container.find("table.Summary tbody");
    var _input = _container.find("input[type=text]");

    _container.find("a.ClearText").unbind("click").bind("click", function (e) {
        _input.val("");
        _content.html("");
        e.preventDefault();
    });

    _input.bind("input", function () {
        var _keyword = _input.val().toLowerCase();
        var _urlRequest = "/users/_DAV/PROPFIND?fields=name,clyde:title,clyde:templateName,clyde:suburb,clyde:postcode,clyde:address,clyde:state&depth=5";
        if (_keyword.replace(/^\s+|\s+$/g, "") != "") {
            $.getJSON(_urlRequest, function (datas) {
                var result = "";
                $(datas).each(function () {
                    var _data = $(this),
                            _title = _data.attr("title").toLowerCase();
                    if (_data.is("[state]") && _title.indexOf(_keyword) != -1) {
                        result += "<tr>";
                        result += "<td>" + _data.attr("title") + "</td>";
                        result += "<td>" + _data.attr("suburb") + "</td>";
                        result += "<td>" + _data.attr("postcode") + "</td>";
                        result += "<td>" + _data.attr("address") + "</td>";
                        result += "<td>" + _data.attr("state") + "</td>";
                        result += "</tr>";
                    }
                });
                _content.html(result);
            });
        } else {
            _content.html("");
        }
    });
}

function initNewUserForm() {
    var modal = $('#modal-new-user');

    $(".btn-add-user").click(function (e) {
        e.preventDefault();
        e.stopPropagation();

        modal.modal('show');
    });

    modal.find("form").forms({
        callback: function (resp) {
            flog("done new user", resp);
            if (resp.nextHref) {
                window.location.href = resp.nextHref;
            } else {
                Msg.info('Saved');
            }
            modal.modal('hide');
        }
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
    $("div.groups").on("click", "a", function (e) {
        flog("clicked", e.target);
        e.preventDefault();
        e.stopPropagation();
        var orgLink = $(e.target);
        orgId.val(orgLink.attr("href"));
        orgTitle.val(orgLink.text());
        $("#org-search").hide();
        flog("clicked", orgId.val(), orgTitle.val());
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
        },
        error: function (resp) {
            Msg.error("An error occurred searching for organisations");
        }
    });
}

function initRemoveUsers() {
    $(".btn-remove-users").click(function (e) {
        var node = $(e.target);
        flog("removeUsers", node, node.is(":checked"));
        var checkBoxes = $('#table-users').find('tbody input[name=toRemoveId]:checked');
        if (checkBoxes.length == 0) {
            Msg.error("Please select the users you want to remove by clicking the checkboxs to the right");
        } else {
            if (confirm("Are you sure you want to remove " + checkBoxes.length + " users?")) {
                doRemoveUsers(checkBoxes);
            }
        }
    });
}

function initAddToGroup() {
    var modal = $("#modal-add-to-group");

    $(".btn-add-to-group").click(function (e) {
        var node = $(e.target);
        flog("addToGroup", node, node.is(":checked"));
        var checkBoxes = $('#table-users').find('tbody input[name=toRemoveId]').filter(':checked');
        if (checkBoxes.length === 0) {
            Msg.error("Please select the users you want to add by clicking the checkboxs to the right");
        } else {
            modal.modal('show');
        }
    });

    modal.find(".groups-wrapper a").click(function (e) {
        e.preventDefault();
        var href = $(e.target).attr("href");
        flog("add to group", href);
        var checkBoxes = $('#table-users').find('tbody input[name=toRemoveId]').filter(':checked');
        doAddUsersToGroup(href, checkBoxes);
    });
}

function doAddUsersToGroup(groupName, checkBoxes) {
    $.ajax({
        type: 'POST',
        data: checkBoxes,
        dataType: "json",
        url: "?groupName=" + groupName,
        success: function (data) {
            flog("success", data);
            $("#modal-add-to-group").modal('hide');
            if (data.status) {
                doSearch();
                Msg.success("Added users ok");
            } else {
                Msg.error("There was a problem adding users. Please try again and contact the administrator if you still have problems");
            }
        },
        error: function (resp) {
            Msg.error("An error occurred adding users. You might not have permission to do this");
        }
    });
}

function doRemoveUsers(checkBoxes) {
    $.ajax({
        type: 'POST',
        data: checkBoxes,
        dataType: "json",
        url: "",
        success: function (data) {
            flog("success", data);
            if (data.status) {
                doSearch();
                Msg.success("Removed users ok");
            } else {
                Msg.error("There was a problem removing users. Please try again and contact the administrator if you still have problems");
            }
        },
        error: function (resp) {
            Msg.error("An error occurred removing users. You might not have permission to do this");
        }
    });
}

function initLoginAs() {
    $("body").on("click", "a.btn-login-as", function (e) {
        e.preventDefault();
        var profileId = $(e.target).attr("href");
        showLoginAs(profileId);
    });
}

function showLoginAs(profileId) {
    var modal = $("#modal-login-as");
    modal.find("ul").html("<li>Please wait...</li>");
    modal.modal('show');
    $.ajax({
        type: 'GET',
        url: profileId + "?availWebsites",
        dataType: "json",
        success: function (response) {
            flog("success", response.data);
            var newList = "";
            if (response.data.length > 0) {
                $.each(response.data, function (i, n) {
                    newList += "<li><a target='_blank' href='" + profileId + "?loginTo=" + n + "'>" + n + "</a></li>";
                });
            } else {
                newList += "<li>The user does not have access to any websites. Check the user's group memberships, and that those groups have been added to the right websites</li>";
            }
            modal.find("ul")
                    .empty()
                    .html(newList);
        },
        error: function (resp) {
            Msg.error("An error occured loading websites. Please try again");
        }
    });
}