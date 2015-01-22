/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function initManageSmsJob() {
    initSmsField();
    initFormDetails();
    initShowRecipients();
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

    $("#smsMsg").keyup(function () {
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

function initFormDetails(){
    $('form[name=frmDetails]').forms({
        valiationMessageSelector: ".page-validation",
        callback: function () {
            $('body').removeClass('dirty');
            Msg.success('Saved');
        },
        error: function () {
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