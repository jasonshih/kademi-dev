function initManageGroupEmail() {
    initHtmlEditors($('.htmleditor'), getStandardEditorHeight(), null, null, 'autogrow');
    initChooseGroup();
    initAdvanceRecipients();
    initFormDetailEmail();
    initShowRecipients();
    initResetPasswordLinkText();
    initEditEmailPage();
    initStatusPolling();
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

    btnShowRecipients.on('click', function(e) {
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
            success: function(resp) {
                flog('got results', resp.data.length, resp.data);
                tableBody.html('');

                if (resp.data.length > 0) {
                    var dataString = '';

                    $.each(resp.data, function(i, profile) {
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
            error: function(resp) {
                alert('Sorry, an error occured collecting the recipient list');
            }
        });
    } catch (e) {
        flog('exception in createJob', e);
    }
}

function initEditEmailPage() {
    var body = $(document.body);

    flog('initEditEmailPage');

    $('.btn-send-email').click(function(e) {
        e.preventDefault();

        if (body.hasClass('dirty')) {
            alert('Please save your changes before sending the email');
        } else {
            sendMailAjax(true);
        }
    });

    $('.btn-preview-email').click(function(e) {
        e.preventDefault();

        if (body.hasClass('dirty')) {
            alert('Please save your changes before sending the preview');
        } else {
            sendMailAjax(false);
        }
    });

    $('input, select, textarea').change(function() {
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
            success: function(data) {
                flog('send has been initiated', data);
                if (reallySend) {
                    alert('Email sending has been initiated. If there is a large number of users this might take some time. This screen will display progress');
                    $('a[href=#status]').trigger('click');
                    $('#recipients').find('.btn-remove-role').remove();
                    $('#status-tools').removeClass('Draft').addClass('Running');

                    initStatusPolling();
                } else {
                    alert('The preview email has been sent to your email address. Please review it');
                }
            },
            error: function(resp) {
                flog('error', resp);
                alert('Failed to start the send job. Please refresh the page');
            }
        });
    } catch (e) {
        flog('exception in createJob', e);
    }
}

function validateEmail() {
    // Check it has recipients
    if (!$('.blocks-wrapper.recipient .block')[0]) {
        alert('Please enter at least one recipient');
        return false;
    }

    // Check it has a message
    var msg = $('textarea[name=html]').val();
    if (msg == null || msg.length == 0) {
        alert('Please enter a message to send');
        return false;
    }

    // Check subject
    var subject = $('input[name=subject]').val();
    if (subject == null || subject.length == 0) {
        alert('Please enter a subject for the email');
        return false;
    }

    // Check from address
    var fromAddress = $('input[name=fromAddress]').val();
    if (fromAddress == null || fromAddress.length == 0) {
        alert('Please enter a from address for the email');
        return false;
    }

    // Check that if doing password reset then a theme is selected
    var sel = $('select[name=themeSiteId]');
    flog('check reset', $('#passwordReset:checked'), sel);
    if ($('#passwordReset:checked').length > 0) {
        if (sel.val() == '') {
            alert('A theme is required for a password reset email. Please choose a theme on the Message tab');
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
            success: function(resp) {
                displayStatus(resp.data);
                if (resp.data.statusCode === '') {
                    setTimeout(pollStatus, 2000);
                } else if (resp.data.statusCode !== 'c') {
                    statusTools.removeClass('Draft').addClass('Running');
                    setTimeout(pollStatus, 2000);
                } else {
                    flog("job status is finished, so just poll open rate");
                    $(".send-progress .progress").hide();
                    $("#open-rate").show();
                    statusTools.removeClass('Running').addClass('Complete');
                    pollOpenRate();
                }
            },
            error: function(resp) {
                flog('error', resp);
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
    var tbody = $('#emails').find('tbody');
    var status = $('#status');
    var progress = status.find('.progress');
    var progressBar = progress.find('.progress-bar');


    if (data.statusCode) {
        status.children('div').hide();
        status.removeClass('status_c status_p');
        status.addClass('status_' + data.statusCode);
        $('.send-progress').show();
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
            txtProgress = 'Preparing emails...';
        }

        progressBar.text(txtProgress);

        addRows(data.sending, 'Sending..', tbody);
        addRows(data.retrying, 'Retrying..', tbody);
    } else {
        status.children('div').hide().filter('.notsent').show();
        tbody.html('');
    }
}

function addRows(list, status, tbody) {
    $.each(list, function(i, e) {
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
        tr = $('<tr id="' + e.emailId + '"></tr><td>' + e.email + '</td><td>' + e.fullName + '</td><td class="status"></td><td class="attempt"></td>');
        tbody.prepend(tr);
    }
    return tr;
}