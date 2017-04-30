function initManagePointsAllocationRule() {
    initCreateModal();
    initDeleteRule();
    initDuplicateRule();
    initRulesCsv();
    initDeleteCheckbox();
}

function initCreateModal() {
    var createModal = $('#modal-new-rule');
    var createForm = createModal.find('form');

    createForm.forms({
        callback: function (resp) {
            if (resp.status) {
                Msg.success(resp.messages[0]);
                createModal.modal('hide');
                createForm.trigger('reset');
                $('#rulesTableContainer').reloadFragment();
            } else {
                Msg.warning(resp.message[0]);
            }
        }
    });
}

function initDeleteRule() {
    $('body').on('click', '.delete-rule', function (e) {
        e.preventDefault();
        var btn = $(this);
        var title = btn.data('title');
        var href = btn.attr('href');
        var row = btn.closest('tr');
        confirmDelete(href, title, function () {
            row.hide('fast', function () {
                row.remove();
            });
        });
    });
}

function initDuplicateRule() {
    $('body').on('click', '.duplicate-rule', function (e) {
        e.preventDefault();
        var btn = $(this);
        var ruleId = btn.attr('href');
        $.ajax({
            type: 'POST',
            url: window.location.pathname,
            data: {
                duplicateRule: ruleId,
            },
            dataType: "json",
            success: function (data) {
                if (data.status) {
                    Msg.success(data.messages[0]);
                    $('#rulesTableContainer').reloadFragment();
                } else {
                    flog("error", data);
                    Msg.error("Sorry, couldnt duplicate " + data);
                }
            },
            error: function (resp) {
                flog("error", resp);
                Msg.error("Sorry, couldnt duplicate - " + resp);
            }
        });
    });
}

function initRulesCsv() {
    var modalUploadCsv = $("#modal-upload-csv");

    var resultUploadCsv = modalUploadCsv.find('.upload-results');
    $("#do-upload-csv").mupload({
        buttonText: "<i class=\"clip-folder\"></i> Upload spreadsheet",
        url: "rules.csv",
        useJsonPut: false,
        oncomplete: function (data, name, href) {
            flog("oncomplete:", data.result.data, name, href);
            resultUploadCsv.find('.num-updated').text(data.result.data.numUpdated);
            resultUploadCsv.find('.num-inserted').text(data.result.data.numInserted);
            resultUploadCsv.find('.num-unmatched').text(data.result.data.unmatched.length);
            showUnmatched(resultUploadCsv, data.result.data.unmatched);
            resultUploadCsv.show();
            Msg.success("Upload completed. Please review any unmatched members below, or refresh the page to see the updated list of products");
            $("#rulesTableContainer").reloadFragment();
        }
    });
}

function initDeleteCheckbox() {
    $('body').on('change', '.check-all', function (e) {
        var checkedStatus = this.checked;
        $('body').find(':checkbox.rule-check').prop('checked', checkedStatus);
    });

    $('body').on('click', '.delete-rules', function (e) {
        e.preventDefault();
        var listToDelete = [];
        $('body').find(':checkbox.rule-check:checked').each(function () {
            listToDelete.push($(this).data("ruleid"));
        });
        if (listToDelete.length > 0 && confirm("Are you sure you want to delete " + listToDelete.length + " allocation rules?")) {
            $('body').find('.check-all').check(false).change();
            flog(listToDelete.join(','));
            deleteRules(listToDelete);
        } else {
            Msg.error('Please select the rules you want to remove by clicking the checkboxes on the right');
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

function deleteRules(listToDelete) {
    for (var i = 0; i < listToDelete.length; i++) {
        deleteFile(listToDelete[i]);
        $("input[data-ruleid=\"" + listToDelete[i] + "\"]").closest("tr").remove();
    }
    Msg.info("Successfully deleted " + listToDelete.length + " rules");
}