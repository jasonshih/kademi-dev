function initManageWebsite() {
    flog("initManageWebsite");
    initGroupCheckbox();
    initApps();
    //initManageMenu();
    initManageWebsiteImage();
    initSwitchPublic();
    initPublishingMenu("");
    initHtmlEditors($(".htmleditor"), "60px", "200px", 'embed_video,modal', 'resize,elementspath');
    initCerts();
    initEmailServerTab();
    initHttpsTab();
    initHstsSettings();
    initXFrameOptionSettings();

    $("form.details").forms({
        callback: function (resp) {
            flog("Saved Ok!");
            Msg.info("Saved");
        }
    });
}

function initXFrameOptionSettings() {
    var form = $('#kxifrime-form');

    form.forms({
        onSuccess: function (resp) {
            Msg.success(resp.messages);
        }
    });

    $('body').on('change', '#kxifrime-xFrameType', function () {
        var select = $(this);
        if (select.val() == 'ALLOW-FROM') {
            $('#kxifrime-fromUriDiv').show();
        } else {
            $('#kxifrime-fromUriDiv').hide();
        }
    });
}

function initHstsSettings() {
    var form = $('#hsts-form');

    form.forms({
        onSuccess: function (resp) {
            Msg.success(resp.messages);
        }
    });
}

function initHttpsTab() {
    flog('initHttpsTab');

    initInputFile();
    initCSRHttps();
    initCertHttps();
    initPKHttps();
}

function initPKHttps() {
    flog('initPKHttps');

    var updatePKModal = $("#modalUpdatePK");
    var updatePKForm = updatePKModal.find(" form");

    updatePKForm.forms({
        callback: function (resp) {
            flog("done", resp);
            updatePKModal.modal('hide');
            Msg.success(resp.messages, 6000);
            $('#certificate-types-table').reloadFragment();
        }
    });
}

function initCertHttps() {
    flog('initCertHttps');

    var addCertModal = $("#addWebsiteHttpsModal");
    var addCertModalForm = addCertModal.find(" form");

    addCertModalForm.forms({
        callback: function (resp) {
            flog("done", resp);
            addCertModal.modal('hide');
            Msg.success(addCertModalForm.find('[name=title]').val() + ' has been created!');
            $('#certificate-types-table').reloadFragment();
        }
    });

    var body = $(document.body);
    var updateCertModal = $("#modalUpdateCert");
    var updateCertForm = updateCertModal.find(" form");

    updateCertForm.forms({
        callback: function (resp) {
            flog("done", resp);
            updateCertModal.modal('hide');
            Msg.success(resp.messages, 6000);
            $('#certificate-types-table').reloadFragment();
        }
    });

    body.on('click', '.btn-add-root-cert', function (e) {
        e.preventDefault();
        var certid = $(this).data("certid");
        var modal = $('#modalUpdateRootCert');

        modal.find(".certId").val(certid);

        modal.modal("show");
    });

    var createRootCertModal = $('#modalUpdateRootCert');
    createRootCertModal.find("form").forms({
        callback: function (resp) {
            flog("done", resp);
            createRootCertModal.modal('hide');
            Msg.success(resp.messages, 6000);
            $('#certificate-types-table').reloadFragment();
        }
    });

    body.on('click', '.btn-delete-rootCert', function (e) {
        e.preventDefault();
        var href = $(this).attr("href");
        var certId = $(this).data("certid");
        flog("rootCertId", href, "certId", certId);
        if (confirm("Are you sure you want to delete this certificate?")) {
            deleteRootCert(certId, href, $(this).closest("tr"));
        }
    });


}

function initCSRHttps() {
    flog('initCSRHttps');

    var genCSRModal = $("#genCsrModal");
    var body = $(document.body);

    body.on('click', '.viewCreateCsr', function (e) {
        e.preventDefault();
        var certId = $(this).data("certid");
        viewCsr(certId);
    });

    body.on('click', '.btn-gen-new-csr', function (e) {
        e.preventDefault();
        if (confirm("Are you sure you want to create a new CSR? Please note this will also replace the current Private Key")) {
            $("#csrTextGroup").hide();
            genCSRModal.find('.viewCsr').hide();
            genCSRModal.find('.csrForm').show();
            genCSRModal.find('.btn-create').show("fade");
        }
    });

    genCSRModal.find("form").forms({
        validate: function () {
            Msg.info("Sending CSR Request...");
            return true;
        },
        callback: function (resp) {
            flog("Saved Ok!");
            Msg.info(resp.messages[0]);
            var csrGroup = $("#csrTextGroup");
            var csr = csrGroup.find("#csrText");
            if (resp.data.csrText === "") {
                csrGroup.hide();
                genCSRModal.find('.viewCsr').hide();
                genCSRModal.find('.csrForm').show();
                genCSRModal.find('.btn-create').show("fade");
            } else {
                genCSRModal.find('.viewCsr').show();
                genCSRModal.find('.csrForm').hide();
                genCSRModal.find('.btn-create').hide("fade");
                csrGroup.show();
                csr.val(resp.data.csrText);
            }
        }
    });
}

function initInputFile() {
    flog('initInputFile');

    $(document).on('change', '.btn-file :file', function () {
        var input = $(this),
                numFiles = input.get(0).files ? input.get(0).files.length : 1,
                label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
        input.trigger('fileselect', [numFiles, label]);
    });

    $('.btn-file :file').on('fileselect', function (event, numFiles, label) {
        var input = $(this).parents('.input-group').find(':text'),
                log = numFiles > 1 ? numFiles + ' files selected' : label;

        if (input.length) {
            input.val(log);
        } else {
            if (log)
                alert(log);
        }
    });
}

function initEmailServerTab() {
    flog('initEmailServerTab');

    var sendTestDkimModal = $("#modal-send-test");
    var sendTestDkimForm = sendTestDkimModal.find("form");

    sendTestDkimForm.forms({
        validate: function () {
            var domainName = $('#domainName').val();
            var senderEmail = sendTestDkimForm.find('[name=senderEmail]').val();
            var senderDomain = senderEmail.substr(senderEmail.indexOf("@") + 1);
            if (domainName.length < 1) {
                return {
                    error: 1,
                    errorFields: ["senderEmail"],
                    errorMessages: ["Website domain can not be empty"]
                }
            } else if (senderDomain !== domainName) {
                return {
                    error: 1,
                    errorFields: ["senderEmail"],
                    errorMessages: ["Email domain doesn't match website domain"]
                }
            } else {
                return true;
            }
        },
        callback: function (resp) {
            flog("Sent DKIM Test", resp);
            sendTestDkimModal.modal("hide");
            Msg.info("DKIM Successfully generated");
            onTestResponse(resp);
        }
    });

    var genDkimModal = $("#modal-gen-dkim");
    var genDkimForm = genDkimModal.find(" form");

    genDkimForm.forms({
        callback: function (resp) {
            flog("done", resp);
            genDkimModal.modal('hide');
            Msg.success(resp.messages, 6000);
            $('#panel_mailserver').reloadFragment();
        }
    });

    var uploadDkimKeyModal = $('#modalUploadPrivateKey');
    var uploadDkimKeyForm = uploadDkimKeyModal.find('form');

    uploadDkimKeyForm.forms({
        callback: function (resp) {
            flog("done", resp);
            uploadDkimKeyModal.modal('hide');
            Msg.success(resp.messages, 6000);
            $('#panel_mailserver').reloadFragment();
        }
    });

    $('body').on('click', '.btn-delete-dkim', function (e) {
        e.preventDefault();

        if (confirm('Are you sure you want to clear the DKIM Key?')) {
            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: window.location.pathname,
                data: {
                    clearDKIM: true
                },
                success: function (resp) {
                    flog("success", resp);
                    $('#panel_mailserver').reloadFragment();
                },
                error: function (resp) {
                    Msg.error("An error occured viewing the certificate");
                }
            });
        }
    });
}

function viewCsr(id) {
    var certID = $("#certId");
    var csr = $("#csrText");
    var csrGroup = $("#csrTextGroup");
    certID.val(id);
    csr.val("");

    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: window.location.pathname,
        data: {
            viewCsrId: id
        },
        success: function (resp) {
            flog("success", resp);
            if (resp.data.csrText == "") {
                csrGroup.hide();
                $("#genCsrModal").find('.viewCsr').hide("fade");
                $("#genCsrModal").find('.csrForm').show("fade");
                $("#genCsrModal").find('.btn-create').show("fade");
            } else {
                $("#genCsrModal").find('.viewCsr').show("fade");
                $("#genCsrModal").find('.csrForm').hide("fade");
                $("#genCsrModal").find('.btn-create').hide("fade");
                csrGroup.show();
                csr.val(resp.data.csrText);
            }
            $("#genCsrModal").modal('show');
        },
        error: function (resp) {
            Msg.error("An error occured viewing the certificate");
        }
    });

}

function initCerts() {
    flog('initCerts');

    $("#certificate-types-table").on("click", ".cert-delete", function (e) {
        e.preventDefault();
        var id = $(e.target).closest("a").attr("href");
        if (confirm("Are you sure you want to delete this certificate?")) {
            deleteCert(id, $(e.target).closest("tr"));
        }
    });
    $("#certificate-types-table").on("click", ".cert-activate", function (e) {
        e.preventDefault();
        var id = $(e.target).closest("a").attr("href");
        updateCertStatus(id, "A");
    });
    $("#certificate-types-table").on("click", ".cert-passivate", function (e) {
        e.preventDefault();
        var id = $(e.target).closest("a").attr("href");
        updateCertStatus(id, "");
    });

    $("#certificate-types-table").on("click", ".update_pk", function (e) {
        e.preventDefault();

        var id = $(e.target).closest("a").attr("href");
        $("#updatePKid").val(id);
        $("#privateKeyTextUpdate").text();

    });

    $("#certificate-types-table").on("click", ".update_cert", function (e) {
        e.preventDefault();

        var id = $(e.target).closest("a").attr("href");
        $("#updateCertId").val(id);
        $("#certificateTextUpdate").text();
    });
}

function updateCertStatus(id, status) {
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: window.location.pathname,
        data: {
            certId: id,
            updateCertStatus: status
        },
        success: function (data) {
            Msg.info("Updated certificate");
            $("#certificates-body").reloadFragment();
        },
        error: function (resp) {
            Msg.error("An error occured updating the certificate");
        }
    });
}

function deleteCert(id, tr) {
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: window.location.pathname,
        data: {
            deleteCertId: id
        },
        success: function (data) {
            Msg.info("Deleted certificate");
            tr.remove();
            //$("#certificates-body").reloadFragment();
        },
        error: function (resp) {
            Msg.error("An error occured deleting the certificate");
        }
    });
}

function deleteRootCert(certId, rootCertid, tr) {
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: window.location.pathname,
        data: {
            deleteRootCertId: rootCertid,
            certId: certId
        },
        success: function (data) {
            Msg.info("Deleted certificate");
            var tbody = tr.closest("tbody");
            tr.remove();
            var rows = tbody.find("tr");
            $(".rootCertCount").text(rows.size());
            if (rows.size() > 0) {
                rows.each(function (index, item) {
                    $(item).find("td.first").text(index + 1);
                });
            } else {
                tbody.append('<tr>'
                        + '<td colspan="3">You have no root/intermediate certificates</td>'
                        + '</tr>');
            }
        },
        error: function (resp) {
            Msg.error("An error occured deleting the certificate");
        }
    });
}

function initSwitchPublic() {
    flog('initSwitchPublic');

    $('.make-switch input').on('change switchChange', function (e) {
        flog("switch", e.target);
        e.preventDefault();

        var label = $(this);
        var wrapper = label.parents('.make-switch');
        var href = wrapper.attr('data-link');

        setTimeout(function () {
            var isChecked = wrapper.find('input:checked').val() === 'true';
            flog("checked=", isChecked);
            setRepoPublicAccess(href, isChecked);
        }, 0);
    });
}

function setRepoPublicAccess(href, isPublic) {
    $.ajax({
        type: 'POST',
        data: {isPublic: isPublic},
        url: href,
        success: function (data) {
        },
        error: function (resp) {
            flog("error updating: ", href, resp);
            Msg.error('Sorry, couldnt update public access: ' + resp);
            window.location.reload();
        }
    });
}

function initManageWebsiteImage() {
    $('#btn-change-ava').upcropImage({
        buttonContinueText: 'Save',
        url: window.location.pathname, // this is actually the default value anyway
        ratio: 4 / 3,
        onCropComplete: function (resp) {
            flog("onCropComplete:", resp, resp.nextHref);
            $("#websiteImage").reloadFragment();
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
                    flog("success");
                    if (resp.status) {
                        Msg.info("Done");
                        $("#websiteImage").reloadFragment();
                    } else {
                        Msg.error("An error occured processing the product image");
                    }
                },
                error: function () {
                    alert('Sorry, we couldn\'t save your profile image.');
                }
            });
        }
    });

}

function initGroupCheckbox() {
    $("#modalGroup input[type=checkbox]").click(function () {
        var $chk = $(this);
        log("checkbox click", $chk, $chk.is(":checked"));
        var isRecip = $chk.is(":checked");
        setGroupRecipient($chk.attr("name"), isRecip);
    });

    $("#group-list").on("click", ".btnRemoveGroup", function (e) {
        flog("click btnRemoveGroup", this);
        e.preventDefault();
        e.stopPropagation();
        var groupName = $(this).attr("href");
        setGroupRecipient(groupName, false);
    });

    $("#addGroupDropdown").on("click", ".addGroup a", function (e) {
        flog("click addGroup", this);
        e.preventDefault();
        var groupName = $(this).attr("href");
        setGroupRecipient(groupName, true);
    });
}

function setGroupRecipient(name, isRecip) {
    log("setGroupRecipient", name, isRecip);
    try {
        $.ajax({
            type: 'POST',
            url: window.location.pathname,
            data: {
                group: name,
                isRecip: isRecip
            },
            dataType: "json",
            success: function (data) {
                if (data.status) {
                    log("saved ok", data);
                    $("#group-list").reloadFragment();
//                    if (isRecip) {
//                        $(".GroupList").append("<div class=\"alert alert-block alert-info\"><span class=\"fa fa-users\"></span>" + name + "</div>");
//                        log("appended to", $(".GroupList"));
//                    } else {
//                        var toRemove = $(".GroupList div").filter(function () {
//                            var thisName = $(this).find("a").text();
//                            flog("filter", this, thisName);
//                            return thisName === name;
//                        });
//                        flog("remove", toRemove);
//                        toRemove.remove();
//                    }
                } else {
                    log("error", data);
                    Msg.error("Sorry, couldnt save " + data);
                }
            },
            error: function (resp) {
                log("error", resp);
                Msg.error("Sorry, couldnt save - " + resp);
            }
        });
    } catch (e) {
        log("exception in createJob", e);
    }
}

function onTestResponse(resp) {
    flog("onTestResponse", resp);
    if (resp.status) {
        var url = resp.nextHref;
        //var win = window.open(url, "_blank");
        var modal = $("#modal-send-test-progress");
        modal.modal();
        var target = modal.find(".modal-body");
        loadEmailItemContent(target, url);
    } else {
        Msg.info("Couldnt not send test email: " + resp.messages);
    }
}

function loadEmailItemContent(target, url) {
    flog("loadEmailItemContent", url);
    target.load(url + ' #email-item-info > *', function (response, status, xhr) {
        setTimeout(function () {
            var complete = target.find(".status-c");
            flog("reload", complete);
            if (complete.length == 0) {
                loadEmailItemContent(target, url);
            }
        }, 3000);
    });
}