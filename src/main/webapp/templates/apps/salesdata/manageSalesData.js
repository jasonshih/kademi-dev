
var options = {
    startDate: null,
    endDate: null,
    interval: "day"
};

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
                $('body').trigger('ajaxLoading', {
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
                    doHistorySearch();
                }
        );
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
    $('body').on('click', '.btn-clear-history', function (e) {
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
    flog('doHistorySearch', startDate, endDate, searchQ);
    Msg.info("Doing search...", 2000);

    var data = {
        startDate: formatDate(startDate),
        finishDate: formatDate(endDate),
        dataQuery: searchQ
    };
    flog("data", data);

    var target = $("#history-table-body");
    target.load();

    $.ajax({
        type: "GET",
        url: window.location.pathname,
        dataType: 'html',
        data: data,
        success: function (content) {
            flog('response', content);
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

function initSeriesGraphControls() {
    flog("initGraphControls");
    var reportRange = $('#analytics-range');

    function cb(start, end) {
        options.startDate = start.format('DD/MM/YYYY');
        options.endDate = end.format('DD/MM/YYYY');
        loadSeriesGraphData();
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

function loadSeriesGraphData() {
    var href = "?dateHistogram&" + $.param(options);
    $.ajax({
        type: "GET",
        url: href,
        dataType: 'html',
        success: function (resp) {
            var json = null;

            if (resp !== null && resp.length > 0) {
                json = JSON.parse(resp);
            }

            flog('response', json);
            handleSeriesData(json);

        }
    });
}


function handleSeriesData(resp) {
    var aggr = (resp !== null ? resp.aggregations : null);

    initSeriesHistogram(aggr);
}


function initSeriesHistogram(aggr) {
    flog("initSeriesHistogram", aggr);

    $('#seriesHistogram svg').empty();
    nv.addGraph(function () {

        var myData = [];
        var series = {
            key: "Records",
            values: []
        };
        myData.push(series);

        $.each(aggr.periodFrom.buckets, function (b, dateBucket) {
            flog("dateBucket", dateBucket);
            series.values.push({x: dateBucket.key, y: dateBucket.aggValue.value});
        });


        flog(myData);

        var chart = nv.models.multiBarChart()
                .margin({right: 100})
                .x(function (d) {
                    return d.x;
                })   //We can modify the data accessor functions...
                .y(function (d) {
                    return d.y;
                })   //...in case your data is formatted differently.
                //.useInteractiveGuideline(true)    //Tooltips which show all data points. Very nice!
                .rightAlignYAxis(true)      //Let's move the y-axis to the right side.
                .showControls(true)       //Allow user to choose 'Stacked', 'Stream', 'Expanded' mode.
                .clipEdge(true);

        chart.xAxis
                .tickFormat(function (d) {
                    return d3.time.format('%x')(new Date(d))
                });

        chart.yAxis
                .tickFormat(d3.format(',.2f'));

        d3.select('#seriesHistogram svg')
                .datum(myData)
                .call(chart);

        nv.utils.windowResize(chart.update);

        return chart;
    });
}