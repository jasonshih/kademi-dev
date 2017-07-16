
$(function () {
    //initHistorySearch();
    $(document.body).on('pageDateChanged', function (e, startDate, endDate) {
        doHistorySearch(startDate, endDate);
    });
    var createTimersModal = $("#createTimersModal");
    var createTimersForm= createTimersModal.find("form");
    createTimersForm.forms({
        onSuccess: function (data) {
            createTimersModal.modal('hide');
            Msg.success("Created timers");
            $('#triggers-body').reloadFragment();
        }
    });
    
    var modal = $('#modal-add-trigger-manual');
    flog("initModalAddEmail", modal);
    modal.find('form').forms({
        onSuccess: function (data) {
            flog('saved ok', data);
            modal.modal('hide');
            Msg.success("Manual trigger created");
            $('#triggers-body').reloadFragment();
        }
    });
    $(".form-triggers").forms({
        validate: function () {
            if (confirm("Are you sure you want to remove the selected triggers?")) {
                return true;
            } else {
                return false;
            }
        },
        onSuccess: function () {
            Msg.info("Deleted delayed triggers");
            $('#triggers-body').reloadFragment({
                whenComplete: function () {
                    selectState = false;
                    flog("Reload Complete", selectState);
                }
            });
        }
    });
    $(".btn-fire").click(function (e) {
        e.preventDefault();
        var form = $(".form-triggers");
        var checked = form.find("input[type=checkbox]:checked");
        if (checked.length === 0) {
            Msg.info("Please select some triggers to fire immediately");
            return;
        }
        var c = confirm("Are you sure you want to fire " + checked.length + " triggers?");
        if (!c) {
            return;
        }
        var data = form.serialize();
        data += "&Fire=true";
        flog("data", data);
        //return;

        $.ajax({
            type: 'POST',
            url: window.location.href,
            data: data,
            dataType: "json",
            error: function (resp) {
                flog('error', resp);
                Msg.error('err');
            },
            success: function (resp) {
                flog("resp", resp);
                if (resp.status) {
                    Msg.info("Fired triggers OK");
                    $('#triggers-body').reloadFragment({
                        whenComplete: function () {
                            selectState = false;
                            flog("Reload Complete", selectState);
                            $("[name=triggerId]").prop("checked", selectState);
                        }
                    });
                } else {
                    Msg.error("Sorry, an error occured attempting to fire the selected triggers: " + resp.messages);
                }
            },
            error: function () {
                Msg.error("Sorry, an error occured attempting to fire the selected triggers");
            }
        });
    });
    initUploadCSV();
    if (uploadTaskName !== false) {
        checkUploadStatus();
    }

    $('body').on('click', '.btn-select-all', function (e) {
        e.preventDefault();
        selectState = (selectState ? false : true);
        $("[name=triggerId]").prop("checked", selectState);
    });
});
function initHistorySearch() {
    var reportRange = $('#report-range');
    reportRange.exist(function () {
        flog("init report range");
        reportRange.daterangepicker({
            format: 'DD/MM/YYYY', // YYYY-MM-DD
            ranges: {
                'Last 7 Days': [moment().subtract('days', 6), moment()],
                'Last 30 Days': [moment().subtract('days', 29), moment()],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')],
                'This Year': [moment().startOf('year'), moment()],
            },
        },
                function (start, end) {
                    flog('onChange', start, end);
                    doHistorySearch(start, end);
                });
    });
}

function doHistorySearch(startDate, endDate) {
    flog('doHistorySearch', startDate, endDate);
    var data = {
        startDate: formatDate(startDate),
        finishDate: formatDate(endDate)
    };
    flog("data", data);
    var target = $("#triggers-body");
    //target.load();

    var dates = "startDate=" + formatDate(startDate) + "&finishDate=" + formatDate(endDate);
    var baseHref = window.location.pathname + "?" + dates;
    var href = baseHref;
    $("a.history-csv").attr("href", "email-history.csv?" + dates);
    $.ajax({
        type: "GET",
        url: href,
        dataType: 'html',
        success: function (content) {
            flog('response', content);
            var newBody = $(content).find("#triggers-body");
            flog("newBody", newBody);
            target.replaceWith(newBody);
            jQuery("abbr.timeago").timeago();
            window.history.pushState(null, "Email History", href);
        }
    });
}
function initUploadCSV() {
    var modalUploadCsv = $("#modal-upload-csv");
    $(".uploadCsv").click(function (e) {
        e.preventDefault();
        modalUploadCsv.show(500);
    });
    $("#do-upload-csv").mupload({
        buttonText: "<i class=\"clip-folder\"></i> Upload csv",
        url: "triggerTimers.csv",
        useJsonPut: false,
        oncomplete: function (data, name, href) {
            flog("oncomplete:", data, name, href);
            Msg.success("Upload completed. Please review status and any error messages below.");
            checkUploadStatus();
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

function checkUploadStatus() {
    flog("checkUploadStatus");
    var jobTitle = $(".job-title");
    var resultUploadCsv = $('.upload-results');
    $.ajax({
        type: 'GET',
        dataType: "json",
        url: "/tasks/" + uploadTaskName,
        success: function (result) {
            flog("success", result);
            if (result.data) {
                var state = result.data.state;
                if (state) {
                    resultUploadCsv.find('.lines-processed').text(state.linesProcessed);
                    resultUploadCsv.find('.num-inserted').text(state.numInserted);
                    resultUploadCsv.find('.num-updated').text(state.numUpdated);
                    resultUploadCsv.find('.num-unmatched').text(state.unmatched.length);
                    showUnmatched(resultUploadCsv, state.unmatched);
                } else {
                    resultUploadCsv.find('.lines-processed').text("-");
                    resultUploadCsv.find('.num-inserted').text("-");
                    resultUploadCsv.find('.num-updated').text("-");
                    resultUploadCsv.find('.num-unmatched').text("-");
                }
                resultUploadCsv.show();
                var modalUploadCsv = $("#modal-upload-csv");
                modalUploadCsv.show(500);
                if (result.data.statusInfo.complete) {
                    // finished
                    var dt = result.data.statusInfo.completedDate;
                    jobTitle.text("Import finished at " + pad2(dt.hours) + ":" + pad2(dt.minutes));
                    $(".upload").show();
                    resultUploadCsv.find('.lines-processed').text(state.linesProcessed);
                    resultUploadCsv.find('.num-inserted').text(state.numInserted);
                    resultUploadCsv.find('.num-unmatched').text(state.unmatched.length);
                    showUnmatched(resultUploadCsv, state.unmatched);
                    return; // dont poll again
                } else {
                    // running
                    jobTitle.text("Import running...");
                    var unmatchedTable = resultUploadCsv.find("table");
                    var tbody = unmatchedTable.find("tbody");
                    tbody.html("");
                    $(".upload").hide();
                }

            } else {
                // waiting to start
                jobTitle.text("Waiting for import job to start ...");
                $(".upload").hide();
            }
            window.setTimeout(checkUploadStatus, 2500);
        },
        error: function (resp) {
            //No job
            resultUploadCsv.hide();
            $(".upload").show();
        }
    });
}