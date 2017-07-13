
var options = {
    startDate: null,
    endDate: null,
    interval: "day"
};


function initLeaderboard() {
    flog("initLeaderboard");

    $("#runLeaderboard").click(function (e) {
        e.preventDefault();
        var url = window.location.pathname + "?leaderboard=true";

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
        var searchQ = inp.val();
        flog(searchQ);
        doQuery(searchQ);
    });
}

function doQuery(searchQ) {
    flog('doHistorySearch', searchQ);
    Msg.info("Doing search...", 2000);

    var data = {
        dataQuery: searchQ
    };

    var target = $("#queryResults");

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

function initDelKpiResult() {
    $('body').on('click', '.btn-del-kpiresult', function (e) {
        e.preventDefault();

        var checked = $('#results table tr td input[name=sel-kpiResult]:checked');
        if (checked.length > 0 && confirm('Are you sure you want to delete ' + checked.length + ' result' + (checked.length > 1 ? 's?' : '?'))) {
            var ids = [];

            $.each(checked, function (i, item) {
                var tr = $(item).closest('tr');
                var id = tr.data('id');
                ids.push(id);
            });

            $.ajax({
                type: 'POST',
                dataType: 'json',
                data: {
                    removeKpiResults: ids.join(',')
                },
                success: function (data) {
                    if (data.status) {
                        Msg.success(data.messages);
                        $('#table-results').reloadFragment();
                    } else {
                        Msg.error(data.messages);
                    }
                },
                error: function () {
                    Msg.error('Oh No! Something went wrong!');
                }
            });
        }
    });
}

function initKpiSeriesGraphControls() {
    flog("initKpiSeriesGraphControls");
    function cb(start, end) {
        options.startDate = start
        options.endDate = end;
        loadKpiSeriesGraphData(window.location.pathname, options, $("#seriesHistogram"), "dateHistogram", {});
    }

    $(document).on('pageDateChanged', function (e, startDate, endDate) {
        cb(startDate, endDate);

        if ($("#runLeaderboard:visible").length){
            $("#runLeaderboard").trigger('click');
        }
    });
}
