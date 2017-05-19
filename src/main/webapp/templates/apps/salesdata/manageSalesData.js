var searchOptions = {
    startDate: null,
    endDate: null,
    query: ''
};

function initManageSalesData() {
    setRecentItem(document.title, window.location.pathname);
    initManageExtraField();
    
    var addRecordModal = $("#addRecordModal");
    addRecordModal.find("form").forms({
        callback: function (resp) {
            if (resp.status) {
                Msg.info("Created record");
                $("#history-table-body").reloadFragment();
                addRecordModal.modal("hide");
            } else {
                Msg.error("Couldnt create record");
            }
        }
    });
    
    $(".refresh-history").click(function (e) {
        e.preventDefault();
        $("#history-table-body").reloadFragment({
            whenComplete: function () {
                $(".timeago").timeago();
            }
        });
    });
    
    $("form.series-form").forms({
        callback: function (resp) {
            if (resp.status) {
                Msg.info("Saved ok");
                if (resp.nextHref) {
                    window.location = "../" + resp.nextHref;
                }
            } else {
                Msg.error("An error occured saving: " + resp);
            }
        }
    });
    
    initHistorySearch();
    initRemoveSalesData();
    initClearHistory();
    initSelectAll();
    initUploads();
    
    $("#addKpiModal").find("form").forms({
        callback: function (resp, form) {
            flog("form", form);
            form.find("input").val("");
            reloadKpiFragment();
            $("#addKpiModal").modal("hide");
        }
    });
    
    $("#addSourceModal").find("form").forms({
        callback: function (resp, form) {
            form.find("input, select").val("");
            $("#sources-table-body").reloadFragment();
            $("#addSourceModal").modal("hide");
        }
    });
    $("#createTestDataModal form").forms({
        callback: function () {
            $("#history-table-body").reloadFragment();
            Msg.info("Created test data");
        }
    });
    
    initDelKpi();
    initDelpoints();
    initDupKpi();
    initDataQuery();

    $("#series-tab-general").on('shown.bs.tab', function (e) {
        $("#seriesHistogram").seriesVis();
    });
    
    $("#seriesHistogram").seriesVis();
}

function initDataQuery() {
    $(document.body).on('keypress', '#data-query', function (e) {
        var code = e.keyCode || e.which;
        if (code == 13) {
            e.preventDefault();
            $(this).change();
            return false;
        }
    });
    
    $(document.body).on('change', '#data-query', function (e) {
        e.preventDefault();
        
        searchOptions.query = $(this).val();
        doHistorySearch();
    });
}

function initDelKpi() {
    var kpis = $(".btn-del-kpi");
    $('#kpis-table-body').on("click", ".btn-del-kpi", function (e) {
        e.preventDefault();
        var href = $(this).attr('href');
        confirmDelete(href, getFileName(href), function () {
            Msg.success('Deleted ' + href);
            reloadKpiFragment();
        });
    });
}

function initDupKpi() {
    $("body").on("click", '.btn-dup-kpi', function (e) {
        e.preventDefault();
        var href = $(this).attr('href');
        $.ajax({
            type: 'POST',
            url: window.location.pathname,
            data: "copyKpi=copyKpi&KpiID=" + href,
            success: function (resp) {
                Msg.success('Duplicated');
                reloadKpiFragment();
            },
            error: function (resp) {
                log('error', resp);
                $(document.body).trigger('ajaxLoading', {
                    loading: false
                });
                if (resp.status === 400) {
                    alert('Sorry, the category could not be created. Please check if a category with that name already exists');
                } else {
                    alert('There was a problem creating the folder');
                }
            }
        });
    });
}

function reloadKpiFragment() {
    $('#kpis-table-body').reloadFragment({
        onComplete: function () {
            initDelKpi();
        }
    });
}

function initDelpoints() {
    $('#sources-table-body').on("click", ".btn-del-points", function (e) {
        e.preventDefault();
        var href = $(this).attr('href');
        confirmDelete(href, getFileName(href), function () {
            Msg.success('Deleted ' + href);
            reloadPointsFragment();
        });
    });
}

function reloadPointsFragment() {
    $("#sources-table-body").reloadFragment({
        onComplete: function () {
            initDelpoints()
        }
    });
}

function initHistorySearch() {
    $(document.body).on('pageDateChanged', function (e, startDate, endDate) {
        searchOptions.startDate = startDate;
        searchOptions.endDate = endDate;
        doHistorySearch();
    });
}

function initRemoveSalesData() {
    $(".btn-remove-history").click(function (e) {
        e.preventDefault();
        var node = $(e.target);
        flog("initRemoveSalesData", node, node.is(":checked"));
        var checkBoxes = $('#history-table').find('tbody input[name=toRemoveId]:checked');
        if (checkBoxes.length === 0) {
            Msg.error("Please select the sales data you want to remove by clicking the checkboxs to the right");
        } else {
            if (confirm("Are you sure you want to remove " + checkBoxes.length + " sales data?")) {
                doRemoveSalesData(checkBoxes);
            }
        }
    });
}

function initClearHistory() {
    // btn-clear-history
    $(document.body).on('click', '.btn-clear-history', function (e) {
        e.preventDefault();
        if (confirm("Are you sure you want to clear all records? This can not be undone!")) {
            $.ajax({
                type: 'POST',
                data: {
                    clearHistory: true
                },
                dataType: "json",
                url: "",
                success: function (data) {
                    flog("success", data);
                    if (data.status) {
                        $('#history-table-body').empty();
                        Msg.success("Removed sales data ok");
                    } else {
                        Msg.error("There was a problem removing sales data. Please try again and contact the administrator if you still have problems");
                    }
                },
                error: function (resp) {
                    Msg.error("An error occurred removing sales data. You might not have permission to do this");
                }
            });
        }
    });
}

function doRemoveSalesData(checkBoxes) {
    Msg.info("Deleting...", 2000);
    $.ajax({
        type: 'POST',
        data: checkBoxes,
        dataType: "json",
        url: "",
        success: function (data) {
            flog("success", data);
            if (data.status) {
                Msg.success("Removed sales data ok");
                checkBoxes.each(function (i, n) {
                    $(n).closest("tr").remove();
                });
            } else {
                Msg.error("There was a problem removing sales data. Please try again and contact the administrator if you still have problems");
            }
        },
        error: function (resp) {
            Msg.error("An error occurred removing sales data. You might not have permission to do this");
        }
    });
}

function doHistorySearch() {
    flog('doHistorySearch', searchOptions.startDate, searchOptions.endDate, searchOptions.query);
    Msg.info("Doing search...", 2000);
    
    flog("data", searchOptions);

    var target = $("#history-table-body");
    target.load();

    $.ajax({
        type: "GET",
        url: window.location.pathname,
        dataType: 'html',
        data: searchOptions,
        success: function (content) {
            Msg.success("Search complete", 2000);
            var newBody = $(content).find("#history-table-body");
            target.replaceWith(newBody);
            $("abbr.timeago").timeago();
            flog("done insert and timeago", $("abbr.timeago"));
        }
    });
}
function initUploads() {
    var modalUploadCsv = $("#modal-upload-csv");
    $(".btn-upload-csv").click(function (e) {
        e.preventDefault();

        modalUploadCsv.modal('show');
    });

    var resultUploadCsv = modalUploadCsv.find('.upload-results');
    $("#do-upload-csv").mupload({
        buttonText: "<i class=\"clip-folder\"></i> Upload spreadsheet",
        url: "records.csv",
        useJsonPut: false,
        oncomplete: function (data, name, href) {
            flog("oncomplete:", data.result.data, name, href);
            resultUploadCsv.find('.num-updated').text(data.result.data.numUpdated);
            resultUploadCsv.find('.num-inserted').text(data.result.data.numInserted);
            resultUploadCsv.find('.num-unmatched').text(data.result.data.unmatched.length);
            showUnmatched(resultUploadCsv, data.result.data.unmatched);
            resultUploadCsv.show();
            Msg.success("Upload completed. Please review any unmatched members below, or refresh the page to see the updated list of members");
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

