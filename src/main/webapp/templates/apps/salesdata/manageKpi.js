
var options = {
    startDate: null,
    endDate: null,
    interval: "day"
};


function initLeaderboard() {
    var leaderboardRange = $('#leaderboardDateRange');
    flog("initLeaderboard", leaderboardRange);
    leaderboardRange.daterangepicker(
            {
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
                startDate = start;
                endDate = end;
            }
    );

    var drp = leaderboardRange.data('daterangepicker');
    flog("drp", drp);
    $("#runLeaderboard").click(function (e) {
        e.preventDefault();
        var startDate = drp.startDate;
        var endDate = drp.endDate;
        flog("drp", drp);
        var val = leaderboardRange.val();
        var url;
        if (val != "") {
            url = window.location.pathname + "?startDate=" + formatDate(startDate) + "&endDate=" + formatDate(endDate) + "&leaderboard=true";
        } else {
            url = window.location.pathname + "?leaderboard=true";
        }
        $("#leaderboardResults").reloadFragment({
            url: url,
            whenComplete: function () {
                Msg.info("Loaded leaderboard");
            }
        });

    });
}

function initQuery() {
    $('body').on('keypress', '#data-query', function (e) {
        var code = e.keyCode || e.which;
        if (code == 13) {
            e.preventDefault();
            $(this).change();
            return false;
        }
    });

    $('body').on('change', '#data-query', function (e) {
        e.preventDefault();
        var inp = $(this);
        searchQ = inp.val();
        flog(searchQ);
        doQuery();
    });

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
                    startDate = start;
                    endDate = end;
                    doQuery();
                }
        );
    });
}

function doQuery() {
    flog('doHistorySearch', startDate, endDate, searchQ);
    Msg.info("Doing search...", 2000);

    var data = {
        startDate: formatDate(startDate),
        finishDate: formatDate(endDate),
        dataQuery: searchQ
    };
    flog("data", data);

    var target = $("#queryResults");
    //                target.load();

    $.ajax({
        type: "GET",
        url: window.location.pathname,
        dataType: 'html',
        data: data,
        success: function (content) {
            flog('response', content);
            Msg.success("Search complete", 2000);
            var newBody = $(content).find("#queryResults");
            flog("replacing ", target);
            target.replaceWith(newBody);

            $("abbr.timeago").timeago();

        }
    });
}

function createLevel(name) {
    flog("createLevel", name);
    $.ajax({
        type: 'POST',
        data: {
            newLevelTitle: name
        },
        dataType: "json",
        url: window.location.pathname,
        success: function (data) {
            if (data.status) {
                Msg.success("Created new level ok");
                $("#levels-table-body").reloadFragment();
            } else {
                Msg.error("There was a problem creating the level. Please try again and contact the administrator if you still have problems");
            }
        },
        error: function (resp) {
            Msg.error("There was a problem removing the level. Please try again and contact the administrator if you still have problems");
        }
    });
}

function doDeleteLevel(id) {
    flog("delete", id);
    var level = $("#level-" + id);
    confirmDelete(id, "this level", function () {
        flog('deleted', level);
        level.remove();
        Msg.success('Deleted level');
    });
}

function submitProcess(processName, periodId) {
    flog("submitProcess", processName);
    $.ajax({
        type: 'POST',
        data: {
            process: processName,
            periodId: periodId
        },
        dataType: "json",
        url: window.location.pathname,
        success: function (data) {
            if (data.status) {
                Msg.success("Submitted for processing");
            } else {
                Msg.error("Could not start processing: " + data.messages);
            }
        },
        error: function (resp) {
            Msg.error("There was a problem submitting the process. Please try again and contact the administrator if you still have problems");
        }
    });
}

function initRemovePeriods() {
    $(".periods-delete").click(function (e) {
        var node = $(e.target);
        flog("initRemovePeriods", $("#periods-table"));
        var checkBoxes = $("#table-periods").find('tbody input.deletePeriodId:checked');
        if (checkBoxes.length === 0) {
            Msg.error("Please select the periods you want to remove by clicking the checkboxs to the right");
        } else {
            if (confirm("Are you sure you want to remove " + checkBoxes.length + " periods?")) {
                doRemovePeriods(checkBoxes);
            }
        }
    });
}

function doRemovePeriods(checkBoxes) {
    var vals = "";
    checkBoxes.each(function (i, n) {
        vals += $(n).val() + ",";
    });
    var data = {
        deletePeriodId: vals
    };
    flog("periodis", data);
    $.ajax({
        type: 'POST',
        data: data,
        dataType: "json",
        url: window.location.pathname,
        success: function (data) {
            flog("success", data);
            if (data.status) {
                $("#table-periods").reloadFragment();
                Msg.success("Removed periods ok");
            } else {
                Msg.error("There was a problem removing periods. Please try again and contact the administrator if you still have problems");
            }
        },
        error: function (resp) {
            Msg.error("An error occurred removing periods. You might not have permission to do this");
        }
    });
}

function initKpiLevelCsv() {
    var modalUploadCsv = $("#modal-upload-csv");
    $("#uploadKpiCsv").click(function (e) {
        e.preventDefault();

        modalUploadCsv.modal('show');
    });

    var resultUploadCsv = modalUploadCsv.find('.upload-results');
    $("#do-upload-csv").mupload({
        buttonText: "<i class=\"clip-folder\"></i> Upload spreadsheet",
        url: "kpiLevels.csv",
        useJsonPut: false,
        oncomplete: function (data, name, href) {
            flog("oncomplete:", data.result.data, name, href);
            resultUploadCsv.find('.num-updated').text(data.result.data.numUpdated);
            resultUploadCsv.find('.num-inserted').text(data.result.data.numInserted);
            resultUploadCsv.find('.num-unmatched').text(data.result.data.unmatched.length);
            showUnmatched(resultUploadCsv, data.result.data.unmatched);
            resultUploadCsv.show();
            Msg.success("Upload completed. Please review any unmatched members below, or refresh the page to see the updated list of members");
            $("#levels-table-body").reloadFragment({
                onComplete: function () {
                    $("#levels-table-body").on("click", ".btn-remove-level", function (e) {
                        e.preventDefault();
                        if (confirm("Are you sure you want to delete this level?")) {
                            var id = $(e.target).closest("a").attr("href");
                            doDeleteLevel(id);
                        }
                    });
                }
            });
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

function xml2string(node) {
    if (typeof (XMLSerializer) !== 'undefined') {
        var serializer = new XMLSerializer();
        return serializer.serializeToString(node);
    } else if (node.xml) {
        return node.xml;
    }
}



function initKpiSeriesGraphControls() {
    flog("initKpiSeriesGraphControls");
    var reportRange = $('#analytics-range');

    function cb(start, end) {
        options.startDate = start.format('DD/MM/YYYY');
        options.endDate = end.format('DD/MM/YYYY');
        loadKpiSeriesGraphData(window.location.href, options, $("#seriesHistogram"));
    }

    reportRange.exist(function () {
        flog("init analytics range");
        reportRange.daterangepicker({
            format: 'DD/MM/YYYY',
            startDate: moment().subtract('days', 6),
            endDate: moment(),
            ranges: {
                'Today': [
                    moment().toISOString(),
                    moment().toISOString()
                ],
                'Last 7 Days': [
                    moment().subtract('days', 6).toISOString(),
                    moment().toISOString()
                ],
                'Last 30 Days': [
                    moment().subtract('days', 29).toISOString(),
                    moment().toISOString()],
                'This Month': [
                    moment().startOf('month').toISOString(),
                    moment().endOf('month').toISOString()],
                'Last Month': [
                    moment().subtract('month', 1).startOf('month').toISOString(),
                    moment().subtract('month', 1).endOf('month').toISOString()],
                'This Year': [
                    moment().startOf('year').toISOString(),
                    moment().toISOString()],
            },
        }, cb);
    });
}
