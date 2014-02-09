function initManageGroupEmail() {
	initHtmlEditors($('.htmleditor'), getStandardEditorHeight(), null, null, 'autogrow');
	initChooseGroup();
	initAdvanceRecipients();
	initFormDetailEmail();
	initShowRecipients();
	initResetPasswordLinkText();
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
			success: function(resp) {
				log('got results', resp.data.length, resp.data);
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
		log('exception in createJob', e);
	}
}

function initEditEmailPage() {
    log("initEditEmailPage");
    initEditActions();


    initStatusPolling();
    $("button.send").click(function(e) {
        e.stopPropagation();
        e.preventDefault();
        if( $("body").hasClass("dirty") ) {
            alert("Please save your changes before sending the email");
        } else {
            sendMail();
        }
    });
    $("button.preview").click(function(e) {
        e.stopPropagation();
        e.preventDefault();
        if( $("body").hasClass("dirty") ) {
            alert("Please save your changes before sending the preview");
        } else {
            previewMail();
        }                
    });
    $("input, select, textarea").change(function() {
        $("body").addClass("dirty");
    });
}

function initEditActions() {
    var chks = $(".actionItem input[type=checkbox]");
    
    chks.click(function(e) {
        var node = $(e.target);
        if( node.is(":checked")) {
            node.closest("div").find("div.actionItemDetails").show(200);
        } else {
            node.closest("div").find("div.actionItemDetails").hide(200);
        }
    });
    chks = chks.filter(":checked");
    log("initEditActions: chcks", chks);
    chks.each(function(i, n) {
        var node = $(n);
        node.parent().find("div.actionItemDetails").show();
    })
}

function validateEmail() {
    // Check it has recipients
    if ($("ul.GroupList li").length == 0) {
        alert("Please enter at least one recipient");
        return false;
    }
    // Check it has a message
    var msg = $("textarea[name=html]").val();
    if (msg == null || msg.length == 0) {
        alert("Please enter a message to send");
        return false;
    }
    // Check subject
    var subject = $("input[name=subject]").val();
    if (subject == null || subject.length == 0) {
        alert("Please enter a subject for the email");
        return false;
    }
    // Check from address    
    var fromAddress = $("input[name=fromAddress]").val();
    if (fromAddress == null || fromAddress.length == 0) {
        alert("Please enter a from address for the email");
        return false;
    }
    // Check that if doing password reset then a theme is selected
    var sel = $("select[name=themeSiteId]");
    log("check reset", $("#passwordReset:checked"), sel);
    if ($("#passwordReset:checked").length > 0) {
        if (sel.val() == "") {
            alert("A theme is required for a password reset email. Please choose a theme on the Message tab");
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
            success: function(data) {
                log("send has been initiated", data);
                if (reallySend) {
                    alert("Email sending has been initiated. If there is a large number of users this might take some time. This screen will display progress");
                    $("a.statusTab").click();
                    $("#manageEmail button").hide();
                    $(".GroupList a").hide();
                    $("#status-tools").removeClass("Draft").addClass("Running");
                    
                    initStatusPolling();
                } else {
                    alert("The preview email has been sent to your email address. Please review it");
                }
            },
            error: function(resp) {
                log("error", resp);
                alert("Failed to start the send job. Please refresh the page");
            }
        });
    } catch (e) {
        log("exception in createJob", e);
    }
}


function initStatusPolling() {
    log("initStatusPolling");
    pollStatus();
}

function pollStatus() {
    //log("pollStatus");
    if ($("div.status:visible").length == 0) {
        //log("status page is not visible, so dont do poll");
        window.setTimeout(pollStatus, 2000);
        return;
    }
    try {
        $.ajax({
            type: 'GET',
            url: window.location.href,
            dataType: "json",
            data: {
                status: "true"
            },
            success: function(resp) {
                displayStatus(resp.data);
                if (resp.data.statusCode === "") {
                    //$("#status-tools").removeClass("Draft").addClass("Running");
                    window.setTimeout(pollStatus, 2000);
                } else if (resp.data.statusCode !== "c") {
                    $("#status-tools").removeClass("Draft").addClass("Running");
                    window.setTimeout(pollStatus, 2000);
                } else {
                    log("job status is finished, so don't poll");
                    $("#status-tools").removeClass("Running").addClass("Complete");
                }
            },
            error: function(resp) {
                log("error", resp);
            }
        });
    } catch (e) {
        log("exception in createJob", e);
    }
}

function displayStatus(data) {
    log("displayStatus", data);
    var tbody = $("#emails tbody");
    if (data.statusCode) {
        $("div.status > div").hide();
        $("div.status").removeClass("status_c");
        $("div.status").removeClass("status_p");
        $("div.status").addClass("status_" + data.statusCode);
        $("div.status div.SendProgress").show();
        $("div.status div.Percent").css("width", data.percent + "%");
        var txtProgress = "";
        if( data.successful > 0 ) {
            var txtProgress = data.successful + " sent ok, ";
        }
        if (data.sending && data.sending.length > 0 ) {
            txtProgress += data.sending.length + " sending, ";
        }

        if (data.totalFailed && data.totalFailed > 0 ) {
            txtProgress += data.totalFailed + " failed, ";
        }
        if (data.retrying && data.retrying.length > 0 ) {
            txtProgress += data.retrying.length + " retrying, ";
        }
        if (data.totalToSend && data.totalToSend > 0 ) {
            txtProgress += data.totalToSend + " in total to send";
        } else {
            txtProgress = "Preparing emails...";
        }
        $("div.status div.stats").text(txtProgress);

        addRows(data.sending, "Sending..", tbody);
        addRows(data.retrying, "Retrying..", tbody);
    } else {
        $("div.status > div").hide();
        $("div.status div.NotSent").show();
        tbody.html("");


    }
}

function addRows(list, status, tbody) {
    $.each(list, function(i, e) {
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