function initManageEmail() {
    stripList();
    initController();
    initList();
    initSortableButton();
    checkCookie();
    initAddJob();
}

function initManageScheduledEmail(allGroups) {
    flog('initManageScheduledEmail');
    
    initGroupCheckbox();
    initEnableSwitcher();
    initTitleEditor();
    initFrequencyGroup();
    initSendTest();
    
    $.timeago.settings.allowFuture = true;
    $('.timeago').timeago();
    
    var edmEditor = $('.edmeditor');
    edmEditor.each(function () {
        var editor = $(this);
        var loading = $(
            '<div class="editor-loading">' +
            '    <span>' +
            '        <span class="loading-icon">' +
            '            <i class="fa fa-spinner fa-spin fa-4x fa-fw"></i>' +
            '        </span>' +
            '        <span class="loading-text">Initializing EDM Editor...</span>' +
            '    </span>' +
            '</div>'
        );
        
        editor.before(loading);
        editor.hide();
        
        editor.edmEditor({
            iframeMode: true,
            allGroups: allGroups,
            snippetsUrl: '_components',
            onReady: function () {
                loading.remove();
            }
        });
    });
    
    $(".show-time-details").click(function (e) {
        e.preventDefault();
        $(".time-details").toggle(200);
    });
    
    $("form").forms({
        onValid: function () {
            flog(edmEditor.edmEditor('getContent'));
            edmEditor.val(edmEditor.edmEditor('getContent'));
        },
        callback: function () {
            $('#textual-description').reloadFragment({
                whenComplete: function () {
                    flog("Saved Ok!");
                    Msg.success('Saved Ok!');
                }
            });
        }
    });
    
    $('body').on('click', '.test', function (e) {
        e.preventDefault();
        sendTest();
    });
    
    $('body').on('change', '[name=periodMultiples]', function (e) {
        var inp = $(this);
        var val = inp.val();
        if (val < 1) {
            inp.val(1);
        }
    });
}

function initFrequencyGroup() {
    flog('initFrequencyGroup');
    
    var group = $('#frequency-group');
    var btnText = group.find('.btn .btn-text');
    var lis = group.find('.dropdown-menu li');
    var txt = $('#sFrequency');
    
    lis.each(function () {
        var li = $(this);
        
        li.on('click', function (e) {
            e.preventDefault();
            
            var a = li.find('a');
            var value = a.attr('data-value');
            
            txt.val(value);
            btnText.html(value);
        });
    });
}

function initTitleEditor() {
    flog('initTitleEditor');
    
    $('#emailTitle').editable({
        url: window.location.pathname,
        name: 'title',
        validate: function (value) {
            if ($.trim(value) == '')
                return 'This field is required';
        },
        success: function (response, newValue) {
            flog(response, newValue);
            if (response.status) {
                Msg.info('Successfully saved title');
            }
        },
        params: function (params) {
            params.title = params.value;
            delete params.name;
            
            return params;
        }
    });
}

function initEnableSwitcher() {
    flog('initEnableSwitcher');
    
    $('.enabledSwitchContainer input').on('switchChange.bootstrapSwitch', function (e, state) {
        flog('Enabled=' + state);
        $.ajax({
            type: 'POST',
            url: window.location.pathname,
            data: 'enabled=' + state,
            dataType: 'json',
            success: function (content) {
                flog('response', content);
            }
        });
    });
}

function initEditEmailPage() {
    initRemoveRecipientGroup();
    addGroupBtn();
    eventForModal();
    initGroupCheckbox();
    
    checkPasswordResetVisible();
    
    jQuery("#passwordReset").change(function () {
        checkPasswordResetVisible();
    });
    
    
    initStatusPolling();
    $("button.send").click(function (e) {
        e.stopPropagation();
        e.preventDefault();
        sendMail();
    });
    $("button.preview").click(function (e) {
        e.stopPropagation();
        e.preventDefault();
        previewMail();
    });
    
    flog("test", $(".test"));
    $(".test").click(function () {
        flog("send test");
        sendTest();
    });
}

function checkPasswordResetVisible() {
    flog("checkPasswordResetVisible");
    var cont = $(".passwordResetContainer");
    var inp = cont.find("input[type=text]");
    if ($("#passwordReset:checked").length > 0) {
        cont.show(100);
        inp.addClass("required");
        if (inp.val() == "") {
            inp.val("Please click here to reset your password");
        }
    } else {
        cont.hide(100);
        inp.removeClass("required");
    }
}

function initRemoveRecipientGroup() {
    flog("initRemoveRecipientGroup");
    $(".GroupList").on("click", "button a", function (e) {
        flog("click", this);
        e.preventDefault();
        e.stopPropagation();
        if (confirm("Are you sure you want to remove this group from the recipient list?")) {
            var a = $(e.target);
            flog("do it", a);
            var href = a.attr("href");
            deleteFile(href, function () {
                a.closest("button").remove();
                $("#modalGroup input[type=checkbox][name=" + href + "]").removeAttr("checked");
            });
        }
    });
}

function initGroupCheckbox() {
    $("#modalGroup input[type=checkbox]").click(function () {
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
            url: window.location.href,
            data: {
                group: name,
                isRecip: isRecip
            },
            success: function (data) {
                flog("saved ok", data);
                if (isRecip) {
                    $(".GroupList").append(
                        '<span class="block ' + name + '">' +
                        name +
                        '</span>'
                    );
                    flog("appended to", $(".GroupList"));
                } else {
                    $(".GroupList ." + name).remove();
                    flog("removed from", $(".GroupList"));
                }
            },
            error: function (resp) {
                flog("error", resp);
                Msg.error('err');
            }
        });
    } catch (e) {
        flog("exception in createJob", e);
    }
}

function initAddJob() {
    flog("initAddJob", $("#moduleCreateJob form"));
    var modalCreateJob = $("#modalCreateJob");
    $("#modalCreateJob form").forms({
        callback: function (data) {
            flog("saved ok", data);
            window.location.href = data.nextHref;
        }
    });
}

function checkCookie() {
    var _sort_type = $.cookie("email-sort-type");
    if (_sort_type) {
        _sort_type = _sort_type.split("#");
        var _type = _sort_type[0];
        var _asc = _sort_type[1] === "asc" ? true : false;
        sortBy(_type, _asc);
        
        switch (_type) {
            case 'date':
                $("a.SortByDate").attr("rel", _asc ? "desc" : "asc");
                break;
            case 'name':
                $("a.SortByName").attr("rel", _asc ? "desc" : "asc");
                break;
            case 'status':
                $("a.SortByStatus").attr("rel", _asc ? "desc" : "asc");
                break;
        }
    }
}

function stripList() {
    $("#manageEmail .Content ul li").removeClass("Odd").filter(":odd").addClass("Odd");
}

function initController() {
    //Bind event for Delete email
    $("body").on("click", "a.DeleteEmail", function (e) {
        e.preventDefault();
        
        var a = $(this);
        flog("do it", a);
        var href = a.attr("href");
        var tr = a.closest('tr');
        var name = tr.attr('data-name');
        
        confirmDelete(href, name, function () {
            Msg.success('Deleted!');
            tr.remove();
            stripList();
            Msg.info("Deleted OK");
        });
    });
}

function initList() {
    $("#manageEmail .Content ul li").each(function (i) {
        $(this).attr("rel", i);
    });
}
;

function initSortableButton() {
    // Bind event for Status sort button
    $("body").on("click", "a.SortByStatus", function (e) {
        e.preventDefault();
        
        var _this = $(this);
        var _rel = _this.attr("rel");
        
        if (_rel === "asc") {
            sortBy("status", true);
            $.cookie("email-sort-type", "status#asc");
            _this.attr("rel", "desc");
        } else {
            sortBy("status", false);
            $.cookie("email-sort-type", "status#desc");
            _this.attr("rel", "asc");
        }
    });
    
    // Bind event for Name sort button
    $("body").on("click", "a.SortByName", function (e) {
        e.preventDefault();
        
        var _this = $(this);
        var _rel = _this.attr("rel");
        
        if (_rel === "asc") {
            sortBy("name", true);
            $.cookie("email-sort-type", "name#asc");
            _this.attr("rel", "desc");
        } else {
            sortBy("name", false);
            $.cookie("email-sort-type", "name#desc");
            _this.attr("rel", "asc");
        }
    });
    
    // Bind event for Date sort button
    $("body").on("click", "a.SortByDate", function (e) {
        e.preventDefault();
        
        var _this = $(this);
        var _rel = _this.attr("rel");
        
        if (_rel === "asc") {
            sortBy("date", true);
            $.cookie("email-sort-type", "date#asc");
            _this.attr("rel", "desc");
        } else {
            sortBy("date", false);
            $.cookie("email-sort-type", "date#desc");
            _this.attr("rel", "asc");
        }
    });
}

function sortBy(type, asc) {
    var list = $("#manageEmail .Content ul li");
    var _list = {};
    var sortObject = function (obj) {
        var sorted = {},
            array = [],
            key,
            l;
        
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                array.push(key);
            }
        }
        
        array.sort();
        if (!asc) {
            array.reverse();
        }
        
        for (key = 0, l = array.length; key < l; key++) {
            sorted[array[key]] = obj[array[key]];
        }
        return sorted;
    };
    
    switch (type) {
        case 'date':
            for (var i = 0, _item; _item = list[i]; i++) {
                _item = $(_item);
                var title = _item.find("span.Date").html();
                var rel = _item.attr("rel");
                _list[title + "#" + rel] = _item;
            }
            break;
        case 'name':
            for (var i = 0, _item; _item = list[i]; i++) {
                _item = $(_item);
                var title = _item.find("span.Name").html();
                var rel = _item.attr("rel");
                _list[title + "#" + rel] = _item;
            }
            break;
        case 'status':
            for (var i = 0, _item; _item = list[i]; i++) {
                _item = $(_item);
                var title = _item.find("span.Status").html();
                var rel = _item.attr("rel");
                _list[title + "#" + rel] = _item;
            }
            break;
    }
    
    _list = sortObject(_list);
    
    var _emailList = $("#manageEmail .Content ul");
    _emailList.html("");
    for (var i in _list) {
        _emailList.append(_list[i]);
    }
    
    stripList();
}


function addGroupBtn() {
    $('.AddGroup').on('click', function (e) {
        e.preventDefault();
        
        var _group = [];
        
        $("div.Recipient .GroupList button").each(function () {
            _group.push(this.getAttribute("data-group"));
        });
        
        showGroupModal(_group);
    });
}

function showGroupModal(group) {
    var _modal = $("#modalGroup");
    flog("showGroupModal", _modal, group);
}

function eventForModal() {
    var _modal = $("#modalGroup");
    
    // Bind close function to Close button
    _modal.find("a.Close").click(function (e) {
        e.preventDefault();
    });
    
}

function validateEmail() {
    // Check it has recipients
    if ($(".GroupList button").length == 0) {
        Msg.error("Please enter at least one recipient");
        return false;
    }
    // Check it has a message
    var msg = $("textarea[name=html]").val();
    if (msg == null || msg.length == 0) {
        Msg.error("Please enter a message to send");
        return false;
    }
    // Check subject
    var subject = $("input[name=subject]").val();
    if (subject == null || subject.length == 0) {
        Msg.error("Please enter a subject for the email");
        return false;
    }
    // Check from address    
    var fromAddress = $("input[name=fromAddress]").val();
    if (fromAddress == null || fromAddress.length == 0) {
        Msg.error("Please enter a from address for the email");
        return false;
    }
    // Check that if doing password reset then a theme is selected
    var sel = $("select[name=themeSiteId]");
    flog("check reset", $("#passwordReset:checked"), sel);
    if ($("#passwordReset:checked").length > 0) {
        if (sel.val() == "") {
            Msg.error("A theme is required for a password reset email. Please choose a theme on the Message tab");
            return false;
        }
    }
    
    return true;
}

function sendMail() {
    sendMailAjax(true);
}

function previewMail() {
    sendMailAjax(false);
}

function sendMailAjax(reallySend) {
    if (!validateEmail()) {
        return;
    }
    try {
        $.ajax({
            type: 'POST',
            url: window.location.href,
            data: {
                sendMail: "true",
                reallySend: reallySend
            },
            success: function (data) {
                flog("send has been initiated", data);
                if (reallySend) {
                    Msg.success("Email sending has been initiated. If there is a large number of users this might take some time. This screen will display progress");
                    $("a.statusTab").click();
                    $("#manageEmail button").hide();
                    $(".GroupList a").hide();
                    $(".Content.Send").html("<h4>Email has been sent, or is sending</h4>");
                    initStatusPolling();
                } else {
                    Msg.info("The preview email has been sent to your email address. Please review it");
                }
            },
            error: function (resp) {
                flog("error", resp);
                Msg.error("Failed to start the send job. Please refresh the page");
            }
        });
    } catch (e) {
        flog("exception in createJob", e);
    }
}


function initStatusPolling() {
    flog("initStatusPolling");
    pollStatus();
}

function pollStatus() {
    flog("pollStatus");
    if ($("div.status:visible").length == 0) {
        flog("status page is not visible, so dont do poll");
        window.setTimeout(pollStatus, 2000);
        return false;
    }
    try {
        $.ajax({
            type: 'GET',
            url: window.location.href,
            dataType: "json",
            data: {
                status: "true"
            },
            success: function (resp) {
                displayStatus(resp.data);
                if (resp.data.statusCode != "c") {
                    window.setTimeout(pollStatus, 2000);
                } else {
                    flog("job status is finished, so don't poll");
                }
            },
            error: function (resp) {
                flog("error", resp);
            }
        });
    } catch (e) {
        flog("exception in createJob", e);
    }
}

function displayStatus(data) {
    flog("displayStatus", data);
    var tbody = $("#emails tbody");
    if (data.statusCode) {
        $("div.status > div").hide();
        $("div.status").removeClass("status_c");
        $("div.status").removeClass("status_p");
        $("div.status").addClass("status_" + data.statusCode);
        $("div.status div.SendProgress").show();
        $("div.status div.Percent").css("width", data.percent + "%");
        var txtProgress = data.successful.length + " sent ok, ";
        
        if (data.failed) {
            txtProgress += data.failed.length + " failed, ";
        }
        if (data.retrying) {
            txtProgress += data.retrying.length + " retrying, ";
        }
        if (data.totalToSend) {
            txtProgress += data.totalToSend + " in total to send";
        }
        $("div.status div.stats").text(txtProgress);
        
        $.each(data.successful, function (i, emailId) {
            var tr = tbody.find("#" + emailId);
            flog("remove", emailId, tr)
            tr.remove();
        });
        addRows(data.sending, "Sending..", tbody);
        addRows(data.retrying, "Retrying..", tbody);
        addRows(data.failed, "Failed", tbody);
    } else {
        $("div.status > div").hide();
        $("div.status div.NotSent").show();
        tbody.html("");
    }
}

function addRows(list, status, tbody) {
    $.each(list, function (i, e) {
        tr = getOrCreateEmailRow(e, tbody);
        if (e.lastError) {
            tr.find("td.status").html("<acronym title='" + e.lastError + "'>" + status + "</acronym>");
        } else {
            tr.find("td.status").text(status);
        }
        tr.find("td.attempt").text(e.retries);
    });
}

function getOrCreateEmailRow(e, tbody) {
    var tr = tbody.find("#" + e.emailId);
    if (tr.length == 0) {
        tr = $("<tr id='" + e.emailId + "'><td>" + e.email + "</td><td>" + e.fullName + "</td><td class='status'></td><td class='attempt'></td></td>");
        tbody.prepend(tr);
    }
    return tr;
}


function sendTest(recipient) {
    flog("sendTest");

    var data = {
        test: true       
    };
    
    if(recipient !== undefined && recipient !== ""){
        data.recipient = recipient;        
    }
    
    try {
        $.ajax({
            type: 'POST',
            url: window.location.href,
            data: data,
            success: function (data) {
                Msg.success("Test sent");
            },
            error: function (resp) {
                flog("error", resp);
                Msg.error("Failed to send test message");
            }
        });
    } catch (e) {
        flog("exception in createJob", e);
    }
}

function initSendTest(){
    $(".btn-sent-test-choose").click(function (e) {
        e.preventDefault();
        $("#modal-send-test").modal();
    });
    
    $('body').on('click', '.test', function (e) {
        e.preventDefault();
        var recipient = $("#recipient").val();
        sendTest(recipient);
    });

}