function initManageGroupEmail() {
    initHtmlEditors($('.htmleditor'), getStandardEditorHeight(), null, null, 'autogrow');
    initChooseGroup();
    initChooseOrganisation();
    initAdvanceRecipients();
    initFormDetailEmail();
    initShowRecipients();
    initResetPasswordLinkText();
    initEditEmailPage();
    initStatusPolling();
    initSendTest();
    initAttachment();

    $(".btn-cancel").click(function (e) {
        e.preventDefault();
        if (confirm("Are you sure you want to permanently cancel this job?")) {
            doControl("stop");
        }
    });

    $("body").on("click", ".selectEmail", function (e) {
        e.preventDefault();
        var li = $(e.target).closest("li");
        var email = li.text();
        var inp = li.closest(".input-group").find("input");
        flog("clicked", li, email, inp);
        inp.val(email);
    });
}

function initResetPasswordLinkText() {
    var txtLinkText = $('#passwordResetLinkText');

    if (txtLinkText.val().trim() === '') {
        txtLinkText.val('Please click here to reset your password');
    }
}

function initShowRecipients() {
    var btnShowRecipients = $('.btn-show-recipients');
    var recipientsWrapper = $('.recipients-wrapper');

    btnShowRecipients.on('click', function (e) {
        e.preventDefault();

        if (recipientsWrapper.hasClass('hide')) {
            recipientsWrapper.removeClass('hide');
        }

        showRecipients(recipientsWrapper.find('table tbody'));
    });
}

function showRecipients(tableBody) {
    try {
        $.ajax({
            type: 'GET',
            url: window.location.pathname + '?recipients',
            dataType: 'json',
            success: function (resp) {
                flog('got results', resp.data.length, resp.data);
                tableBody.html('');

                if (resp.data.length > 0) {
                    var dataString = '';

                    $.each(resp.data, function (i, profile) {
                        dataString +=
                                '<tr>' +
                                '<td><a href="/manageUsers/' + profile.userId + '">' + profile.name + '</a></td>' +
                                '<td>' + profile.email + '</td>' +
                                '<td>' + profile.firstName + '</td>' +
                                '<td>' + profile.surName + '</td>' +
                                '</tr>';
                    });

                    tableBody.append(dataString);
                } else {
                    tableBody.html('<tr><td colspan="4">No recipients</td></tr>');
                }
            },
            error: function (resp) {
                Msg.error('Sorry, an error occured collecting the recipient list');
            }
        });
    } catch (e) {
        flog('exception in createJob', e);
    }
}

function initEditEmailPage() {
    var body = $(document.body);

    flog('initEditEmailPage');

    $('.btn-send-email').click(function (e) {
        e.preventDefault();

        if (body.hasClass('dirty')) {
            Msg.error('Please save your changes before sending the email');
        } else {
            sendMailAjax(true);
        }
    });

    $('.btn-preview-email').click(function (e) {
        e.preventDefault();

        if (body.hasClass('dirty')) {
            Msg.error('Please save your changes before sending the preview');
        } else {
            sendMailAjax(false);
        }
    });

    $('input, select, textarea').change(function () {
        body.addClass('dirty');
    });
}

function sendMailAjax(reallySend) {
    if (!validateEmail()) {
        return false;
    }

    try {
        $.ajax({
            type: 'POST',
            url: window.location.href,
            data: {
                sendMail: 'true',
                reallySend: reallySend
            },
            success: function (data) {
                flog('send has been initiated', data);
                if (reallySend) {
                    Msg.success('Email sending has been initiated. If there is a large number of users this might take some time. This screen will display progress');
                    $('a[href=#status]').trigger('click');
                    $('#recipients').find('.btn-remove-role').remove();
                    $('#status-tools').attr('class', 'Running page-action');

                    initStatusPolling();
                } else {
                    Msg.info('The preview email has been sent to your email address. Please review it');
                }
            },
            error: function (resp) {
                flog('error', resp);
                Msg.error('Failed to start the send job. Please refresh the page');
            }
        });
    } catch (e) {
        flog('exception in createJob', e);
    }
}

function doControl(command) {
    try {
        $.ajax({
            type: 'POST',
            url: window.location.href,
            data: {
                control: command
            },
            success: function (data) {
                flog("Done");
                window.location.reload();
            },
            error: function (resp) {
                flog('error', resp);
                Msg.error('Failed to send the command');
            }
        });
    } catch (e) {
        flog('exception in createJob', e);
    }
}


function validateEmail() {
    // Check it has recipients
    if (!$('.blocks-wrapper.recipient .block')[0]) {
        Msg.error('Please enter at least one recipient');
        return false;
    }

    // Check subject
    var subject = $('input[name=subject]').val();
    if (subject == null || subject.length == 0) {
        Msg.error('Please enter a subject for the email');
        return false;
    }

    // Check that if doing password reset then a theme is selected
    var sel = $('select[name=themeSiteId]');
    flog('check reset', $('#passwordReset:checked'), sel);
    if ($('#passwordReset:checked').length > 0) {
        if (sel.val() == '') {
            Msg.error('A website is required for a password reset email. Please choose a theme on the Message tab');
            return false;
        }
    }

    return true;
}

function initStatusPolling() {
    flog("initStatusPolling");
    pollStatus();
}

function pollStatus() {
    var statusTools = $('#status-tools');

    if ($('#status:visible').length == 0) {
        setTimeout(pollStatus, 2000);
        return;
    }
    $("#open-rate").hide();
    try {
        $.ajax({
            type: 'GET',
            url: window.location.href,
            dataType: 'json',
            data: {
                status: 'true'
            },
            success: function (resp) {
                if (resp.status) {
                    displayStatus(resp.data);
                    if (resp.data.statusCode === '') {
                        setTimeout(pollStatus, 2000);
                    } else if (resp.data.statusCode === 's') {
                        statusTools.attr('class', 'Canceled page-action');
                    } else if (resp.data.statusCode !== 'c') {
                        statusTools.attr('class', 'Running page-action');
                        setTimeout(pollStatus, 2000);
                    } else {
                        flog("job status is finished, so just poll open rate");
                        $(".send-progress .progress").hide();
                        $("#open-rate").show();
                        statusTools.attr('class', 'Completed page-action');
                        pollOpenRate();
                    }
                } else {
                    setTimeout(pollStatus, 2000);
                }
            },
            error: function (resp) {
                flog('error', resp);
                setTimeout(pollStatus, 2000);
            }
        });
    } catch (e) {
        flog('exception in createJob', e);
    }
}

function pollOpenRate() {
    flog("pollOpenRate");
    $("#open-rate").reloadFragment();
    setTimeout(pollOpenRate, 10000);
}

function displayStatus(data) {
    flog('displayStatus', data);
    var status = $('#status');
    var progress = status.find('.progress');
    var progressBar = progress.find('.progress-bar');

    if (data.statusCode) {
        status.children('div').hide();
        status.removeClass('status_r status_c status_p status_s');
        status.addClass('status_' + data.statusCode);

        $('.send-progress').show();
        if (data.statusCode == "s") {
            $('.progress').hide();
        } else {
            $('.progress').show();
        }
        var percent = (data.successful + data.totalFailed) * 100 / data.totalToSend;
        flog("progress", percent, (data.successful + data.totalFailed), data.totalToSend);
        flog("progres", progressBar);
        progressBar.css('width', percent + '%');

        var txtProgress = '';
        if (data.successful > 0) {
            txtProgress = data.successful + ' sent ok, ';
        }

        if (data.sending && data.sending.length > 0) {
            txtProgress += data.sending.length + ' sending, ';
        }

        if (data.totalFailed && data.totalFailed > 0) {
            txtProgress += data.totalFailed + ' failed, ';
        }

        if (data.retrying && data.retrying.length > 0) {
            txtProgress += data.retrying.length + ' retrying, ';
        }

        if (data.totalToSend && data.totalToSend > 0) {
            txtProgress += data.totalToSend + ' in total to send';
        } else {
            txtProgress = data.statusDescription;
        }

        progressBar.next().text(txtProgress);

        $('#groupEmail-totalToSend').text(data.totalToSend);
        $('#groupEmail-totalGenerated').text(data.totalGenerated);
        $('#groupEmail-totalSuccessful').text(data.successful);
        $('#groupEmail-totalFailed').text(data.totalFailed);
        $('#groupEmail-totalOpened').text(data.opened);
        $('#groupEmail-totalConverted').text(data.converted);
        $('#groupEmail-totalRetrying').text(data.totalRetrying);
    } else {
        status.children('div').hide().filter('.notsent').show();
    }
}

function addRows(list, status, tbody) {
    $.each(list, function (i, e) {
        tr = getOrCreateEmailRow(e, tbody);

        if (e.lastError) {
            tr.find('td.status').html('<abbr title="' + e.lastError + '">' + status + '</abbr>');
        } else {
            tr.find('td.status').text(status);
        }
        tr.find('td.attempt').text(e.retries);
    });
}

function getOrCreateEmailRow(e, tbody) {
    var tr = tbody.find('#' + e.emailId);

    if (tr.length === 0) {
        tr = $('<tr id="' + e.emailId + '"><td>' + e.email + '</td><td>' + e.fullName + '</td><td class="status"></td><td class="attempt"></td></tr>');
        tbody.prepend(tr);
    }

    return tr;
}

function removeOkRows(list, tbody) {
    if (list.length === 0) {
        tbody.find('tr').remove();
    } else {
        var keepList = {};
        $.each(list, function (i, e) {
            keepList[e.emailId] = e;
        });

        tbody.find('tr').each(function () {
            var tr = $(this);
            var id = +tr.attr('id');

            if (!(id in keepList)) {
                tr.remove();
            }
        });
    }
}

function initAttachment() {
    var attachmentsList = $('.attachments-list');

    $('.add-attachment').mupload({
        buttonText: '<i class="clip-folder"></i> Upload attachment',
        useJsonPut: false,
        oncomplete: function (data, name) {
            flog('oncomplete. name=', name, 'data=', data);
            showAttachment(data, attachmentsList);
        }
    });

    attachmentsList.on('click', '.btn-delete-attachment', function (e) {
        e.preventDefault();

        var btn = $(this);
        var href = btn.attr('href');

        doRemoveAttachment(href, function () {
            btn.closest('article').remove();
        });
    });
}

function showAttachment(data, attachmentsList) {
    flog('attach', data);

    var name = data.name;
    var hash = data.result.nextHref;

    attachmentsList.append(
            '<article>' +
            '<span class="article-name">' +
            '<a target="_blank" href="/_hashes/files/' + hash + '">' + name + '</a>' +
            '</span>' +
            '<aside class="article-action">' +
            '<a class="btn btn-xs btn-danger btn-delete-attachment" href="' + name + '" title="Remove"><i class="clip-minus-circle"></i></a>' +
            '</aside>' +
            '</article>'
            );
}

function doRemoveAttachment(name, callback) {
    if (confirm("Are you sure you want to delete attachment " + name + "?")) {
        try {
            $.ajax({
                type: 'POST',
                url: window.location.pathname,
                data: {
                    removeAttachment: name
                },
                success: function (data) {
                    flog('saved ok', data);
                    callback();
                },
                error: function (resp) {
                    flog('error', resp);
                    Msg.error('Sorry, we couldnt remove the attachment. Please refresh the page and try again');
                }
            });
        } catch (e) {
            Msg.error('Sorry, we couldnt remove the attachment. Please refresh the page and try again');
        }
    }
}

function initGroupEmailListStatusPolling() {
    $('.emailStatusRunning').each(function (i, item) {
        var a = $(item);
        var row = a.closest('tr');
        var href = row.data('jobhref');
        new GroupStatusPolling(row, href);
    });
}

function GroupStatusPolling(row, href) {
    var _self = this;

    _self.row = row;
    _self.href = href;

    _self.startPolling();
}


GroupStatusPolling.prototype.startPolling = function () {
    var _self = this;

    if (_self.pollingTimer) {
        _self.pollingTimer = window.clearTimeout(_self.pollingTimer);
    }

    _self.pollingTimer = window.setTimeout(_self.doPoll.bind(_self), 5000);
};

GroupStatusPolling.prototype.doPoll = function () {
    var _self = this;
    _self.pollingTimer = window.clearTimeout(_self.pollingTimer);

    $.ajax({
        type: 'GET',
        url: _self.href,
        dataType: 'json',
        data: {
            status: 'true'
        },
        success: function (resp) {
            if (resp.status) {
                _self.row.find('.groupEmail-totalToSend').text(resp.data.totalToSend);
                _self.row.find('.groupEmail-successful').text(resp.data.successful);
                _self.row.find('.groupEmail-opened').text(resp.data.opened);
                _self.row.find('.groupEmail-converted').text(resp.data.converted);

                var open = (resp.data.opened / resp.data.successful) * 100;
                var openRate = parseFloat(Math.round(open * 100) / 100).toFixed(1);
                if (Number.isNaN(openRate)) {
                    openRate = '';
                } else {
                    openRate += '%';
                }
                _self.row.find('.groupEmail-openRate').text(openRate);
                
                var convertedRate = (resp.data.converted / resp.data.successful) * 100;
                if (Number.isNaN(convertedRate)) {
                    convertedRate = '';
                } else {
                    convertedRate += '%';
                }
                _self.row.find('.groupEmail-conversionRate').text(convertedRate);
            }
            _self.startPolling();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            _self.startPolling();
        }
    });
};