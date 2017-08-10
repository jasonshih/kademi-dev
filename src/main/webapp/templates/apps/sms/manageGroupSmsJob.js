/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function initManageSmsJob() {
    initSmsField();
    initFormDetails();
    initShowRecipients();
    initChooseGroup();
    initSendTest();
    initSend();
}

function initChooseGroup() {
    initChooseGroupModal();
    initRemoveRecipientGroup();
}

function initChooseGroupModal() {
    var modal = $('#modal-choose-group');

    modal.find('input:radio').on('click', function () {
        var radioBtn = $(this);
        flog("radiobutton click", radioBtn, radioBtn.is(":checked"));
        setGroupRecipient(radioBtn.attr('name'), radioBtn.val());
    });
}

function initRemoveRecipientGroup() {
    var blockWrapper = $('#recipients');
    flog('initRemoveRecipientGroup');

    blockWrapper.on('click', '.btn-remove-role', function (e) {
        flog('click', this);
        e.preventDefault();
        e.stopPropagation();

        if (confirm('Are you sure you want to remove this group?')) {
            var btn = $(this);
            flog('do it', btn);

            var href = btn.attr('href');
            setGroupRecipient(href, "none");
            $('#modal-choose-group').find('input:radio').filter('[name=' + href + ']').removeAttr('checked');
        }
    });
}

function initSmsField() {
    var sms_txt_max = 160;

    var ln = sms_txt_max - $("#smsMsg").val().length;
    if (ln < 0) {
        $("#sms-char-remaining").text(Math.abs(ln) + " characters over");
        $("#sms-char-remaining").css('color', 'red');
    } else {
        $("#sms-char-remaining").text(ln + " characters remaining");
        $("#sms-char-remaining").css('color', '');
    }

    $('#smsMsg').bind('input propertychange', function (e) {
        flog(e);
        var ln = sms_txt_max - $("#smsMsg").val().length;
        if (ln < 0) {
            $("#sms-char-remaining").text(Math.abs(ln) + " characters over");
            $("#sms-char-remaining").css('color', 'red');
        } else {
            $("#sms-char-remaining").text(ln + " characters remaining");
            $("#sms-char-remaining").css('color', '');
        }
    });
}

function initFormDetails() {
    $('form[name=frmDetails]').forms({
        validationMessageSelector: ".page-validation",
        onSuccess: function () {
            $('body').removeClass('dirty');
            Msg.success('Saved');
        },
        onError: function () {
            Msg.error("Some information is not valid. Please check the details");
        }
    });
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

function initSendTest() {
    $('body').on('click', '.btn-sent-test', function (e) {
        e.preventDefault();
        doSendTest();
    });
    var testModal = $('#modal-send-test');
    var testForm = testModal.find('form');

    testForm.forms({
        onSuccess: function (resp) {
            if (resp.status) {
                Msg.success('Saved');
            } else {
                Msg.warning(resp.messages);
            }
        }
    });
}

function initSend() {
    $('body').on('click', '.btn-send-sms', function (e) {
        e.preventDefault();
        doSendSms();
        $(this).prop('disabled', true);
    });
}

function doSendTest() {
    flog("doSendTest");
    $.ajax({
        type: 'POST',
        url: window.location.pathname,
        datatype: 'json',
        data: {
            sendTest: true
        },
        success: function (resp) {
            if (resp.status) {
                Msg.success('A test has been sent to your phone number');
            } else {
                Msg.warning(resp.messages);
            }
            //onTestResponse(resp);
        },
        error: function (resp) {
            Msg.error('Sorry, we couldnt send the test. Please contact the administator to help find the problem.');
        }
    });
}

function doSendSms() {
    flog("doSendTest");
    $.ajax({
        type: 'POST',
        url: window.location.pathname,
        datatype: 'json',
        data: {
            sendSmsJob: true
        },
        success: function (resp) {
            Msg.success('Sms sending has been initiated. If there is a large number of users this might take some time.');
            //onTestResponse(resp);
        },
        error: function (resp) {
            Msg.error('Sorry, we couldnt send the test. Please contact the administator to help find the problem.');
        }
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
                                '<td>' + profile.phone + '</td>' +
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

function setGroupRecipient(name, groupType) {
    flog("setGroupRecipient", name, groupType);
    try {
        $.ajax({
            type: 'POST',
            url: window.location.href,
            data: {
                group: name,
                groupType: groupType
            },
            success: function (data) {
                flog("saved ok", name);

                var blockWrapper = $('#recipients').find('.blocks-wrapper');
                blockWrapper.find('.block.' + name).remove();

                flog("add to list");
                blockWrapper.filter('.' + groupType).append(
                        '<span class="block ' + name + '">' +
                        '<span class="block-name">' + name + '</span>' +
                        '<a class="btn btn-xs btn-danger btn-remove-role" href="' + name + '" title="Remove this role"><i class="clip-minus-circle "></i></a>' +
                        '</span>'
                        );
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