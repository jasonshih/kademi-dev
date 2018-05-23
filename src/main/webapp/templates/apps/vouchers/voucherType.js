$(function () {

    initSearchVoucher();
    initManageExtraField();
    initSelectAll();
    //initDeleteVouchers();
    initContentForm();
    initTestTemplate();


    function initTestTemplate() {
        $("body").on("click", "#testTemplate", function () {
            $.ajax({
                type: 'POST',
                url: window.location.pathname,
                data: {
                    "testTemplate": true,
                    "voucherIdTemplate": $("#voucherIdTemplate").val()
                },
                success: function (data) {
                    var d = JSON.parse(data);
                    flog("Response", d);
                    if (d.data !== null) {
                        Msg.info(d.data);
                    } else {
                        Msg.error(d.messages[0]);
                    }
                },
                error: function (resp) {
                    Msg.error("An error occured testing the template.");
                }
            });
        });
    }


    $('abbr.timeago').timeago();

    $("#voucherDetails").forms({
        onSuccess: function (resp, form) {
            Msg.info("Saved ok");
            flog("onSuccess", resp);
            var newName = $("input[name=name]").val();
            flog("check names", oldName, newName);
            if (oldName != newName) {
                flog("redirect");
                window.location = "../" + newName;
            }
        },
        onError: function (resp, form) {
            flog(resp);
            Msg.error(resp.messages[0]);
        }
    });
    var oldName = $("input[name=name]").val();
    $("#createVouchersForm").forms({
        onSuccess: function () {
            Msg.info("Created vouchers");
            $("#createVouchersModal").modal('hide');
            $("#vouchers-table-body").reloadFragment({
                whenComplete: setTimeout(reloadVouchers, 500)
            });
        }
    });

    var selectOrgModal = $("#selectOrgModal");
    var selectRedeemingOrgForm = $("#selectRedeemingOrgForm");
    $(".change-redeeming-org").click(function (e) {
        e.preventDefault();
        selectOrgModal.modal('show');
    });
    /*
     selectRedeemingOrgForm.submit(function (e) {
     e.preventDefault();
     var val = selectRedeemingOrgForm.find("input").val();
     $("#redeemingOrgId").val(val);
     selectOrgModal.modal("hide");
     $(".change-redeeming-org .org-title").text(val);
     });
     */
    $("#doUploadCsv").mupload({
        buttonText: "<i class=\"clip-folder\"></i> Upload spreadsheet",
        url: "vouchers.csv",
        useJsonPut: false,
        oncomplete: function (data, name, href) {
            log("oncomplete:", data.result.data, name, href);
            if (data.result.status) {
                $(".results .numUpdated").text(data.result.data.numUpdated);
                $(".results .numInserted").text(data.result.data.numInserted);
                $(".results .numUnmatched").text(data.result.data.unmatched.length);
                showUnmatched(data.result.data.unmatched);
                $(".results").show();
                Msg.success("Upload completed. Please review any unmatched members below, or refresh the page to see the updated list of members");
                reloadVouchers();
            } else {
                Msg.error("Uploading failed: " + data.result.messages);
            }
        }
    });
});
function initSearchVoucher() {
    $("#voucher-query").keyup(function () {
        typewatch(function () {
            flog("do search");
            doSearch();
        }, 500);
    });
}
function doSearch() {
    var query = $("#voucher-query").val();
    flog("doSearch", query);
    $.ajax({
        type: 'GET',
        url: window.location.pathname + "?voucher-query=" + query,
        success: function (data) {
            flog("success", data);
            var $fragment = $(data).find("#vouchers-table-body");
            $("#vouchers-table-body").replaceWith($fragment);
            $('abbr.timeago').timeago();
        },
        error: function (resp) {
            Msg.error("An error occured doing the user search. Please check your internet connection and try again");
        }
    });
}

function reloadVouchers() {
    $("#vouchers").reloadFragment({
        url: window.location.href,
        whenComplete: function () {
            $('abbr.timeago').timeago();
        }
    });
}

function showUnmatched(unmatched) {
    var unmatchedTable = $(".results table");
    var tbody = unmatchedTable.find("tbody");
    tbody.html("");
    $.each(unmatched, function (i, row) {
        log("unmatched", row);
        var tr = $("<tr>");
        $.each(row, function (ii, field) {
            tr.append("<td>" + field + "</td>");
        });
        tbody.append(tr);
    });
    unmatchedTable.show();
}

function initOrgFinder() {
    $('input#redeemingOrgId').entityFinder({
        useActualId: true,
        type: 'organisation'
    });
}

function initContentForm() {
    var form = $('#voucherContent-form');
    initVoucherEditor();
    form.forms({
        onSuccess: function (resp) {
            Msg.success(resp.messages);
        }
    });
}

function initVoucherEditor() {
    initIframeEDMEditor($("#voucherContent").find('.contenteditor'));
}