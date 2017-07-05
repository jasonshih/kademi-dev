
var searchData = {
    startDate: null,
    endDate: null
};

function initManageEmailHistory() {
    $('abbr.timeago').timeago();
    flog("Init email history");
    $("#email-query").keyup(function () {
        typewatch(function () {
            flog("do search");
            doSearch();
        }, 500);
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
                    searchData.startDate = start.format("DD/MM/YYYY");
                    searchData.endDate = end.format("DD/MM/YYYY");
                    doSearch(start, end);
                    loadAnalytics();
                }
        );
    });

    initSelectAll();
    initMarkIgnored();
    loadAnalytics();
}

function doSearch(startDate, endDate) {
    var query = $("#email-query").val();
    flog("doSearch", query);
    var data = {
        q: query,
        startDate: formatDate(startDate),
        finishDate: formatDate(endDate)
    };
    $('#downloadCsv').attr('href', 'emailItems.csv?' + $.param(data));

    $('#email-table').reloadFragment({
        url: window.location.pathname + '?' + $.param(data),
        whenComplete: function () {
            $('abbr.timeago').timeago();
        }
    });

    /**
     $.ajax({
        type: 'GET',
        url: window.location.pathname,
        data: data,
        success: function (data) {
            flog("success", data);
            var $fragment = $(data).find("#table-users");
            $("#table-users").replaceWith($fragment);
            $('abbr.timeago').timeago();
        },
        error: function (resp) {
            Msg.error("An error occured doing the user search. Please check your internet connection and try again");
        }
    });
     **/
}

function initMarkIgnored() {
    flog('initMarkIgnored');

    $('body').on('click', '.btn-mark-ignored', function (e) {
        e.preventDefault();

        var checkBoxes = $('#history-table-body td input[name=markIgnored]:checked');

        var edmids = [];

        checkBoxes.each(function (i, item) {
            var a = $(item);
            edmids.push(a.data('edmid'));
        });

        if (edmids.length > 0 && confirm('Are you sure you want to mark ' + edmids.length + ' email' + (edmids.length > 1 ? 's' : '') + ' as ignored?')) {
            $.ajax({
                type: 'POST',
                url: window.location.href,
                dataType: "json",
                data: {
                    markIgnored: edmids.join(',')
                },
                success: function (resp) {
                    $('.selectAll').prop('checked', false);
                    if (resp.status) {
                        $('#history-table-body').reloadFragment();
                        Msg.success(resp.messages);
                    } else {
                        Msg.warning(resp.messages);
                    }
                },
                error: function (resp) {
                    flog('error', resp);
                    Msg.error('err');
                }
            });
        }
    });

    $('body').on('click', '.btn-mark-included', function (e) {
        e.preventDefault();

        var checkBoxes = $('#history-table-body td input[name=markIgnored]:checked');

        var edmids = [];

        checkBoxes.each(function (i, item) {
            var a = $(item);
            edmids.push(a.data('edmid'));
        });

        if (edmids.length > 0 && confirm('Are you sure you want to mark ' + edmids.length + ' email' + (edmids.length > 1 ? 's' : '') + ' as included?')) {
            $.ajax({
                type: 'POST',
                url: window.location.href,
                dataType: "json",
                data: {
                    markIncluded: edmids.join(',')
                },
                success: function (resp) {
                    $('.selectAll').prop('checked', false);
                    if (resp.status) {
                        $('#history-table-body').reloadFragment();
                        Msg.success(resp.messages);
                    } else {
                        Msg.warning(resp.messages);
                    }
                },
                error: function (resp) {
                    flog('error', resp);
                    Msg.error('err');
                }
            });
        }
    });

}


function loadAnalytics() {
    flog("loadAnalytics");

    var href = "?emailHistory&" + $.param(searchData);
    $.ajax({
        type: "GET",
        url: href,
        dataType: 'json',
        success: function (json) {
            flog('response', json);
            initHistogram(json.aggregations);
        }
    });

    href = "?emailStats&" + $.param(searchData);
    $.ajax({
        type: "GET",
        url: href,
        dataType: 'json',
        success: function (resp) {
            flog("emailstats", resp);
            initPies(resp.aggregations);
        }
    });

}

function initPies(aggr) {
    initPie("pieDevice", 'Device', aggr.deviceCategory);
    initPie("pieClient", 'Client', aggr.userAgentType);
    initPie("pieDomain", 'Domain', aggr.domain);
    initPie("pieUrl", 'URL', aggr.visitedUrl);
}
function initPie(id, title, aggr) {

    flog("initPie", id, aggr);

    $('#' + id + ' svg').empty();
    nv.addGraph(function () {
        var chart = nv.models.pieChart()
                .x(function (d) {
                    return d.key;
                })
                .y(function (d) {
                    return d.doc_count;
                })
                .donut(true)
                .donutRatio(0.45)
                .showLabels(true)
                .showLegend(false)
                .title(title)
                .labelType("percent");


        d3.select("#" + id + " svg")
                .datum(aggr.buckets)
                .transition().duration(350)
                .call(chart);

        return chart;
    });
}

function initHistogram(aggr) {
    $('#chart_histogram svg').empty();
    nv.addGraph(function () {
        var chart = nv.models.multiBarChart()
                .options({
                    showLegend: true,
                    showControls: false,
                    noData: "No Data available for histogram",
                    margin: {
                        left: 40,
                        bottom: 60
                    }
                });

        chart.xAxis
                .axisLabel("Date")
                .rotateLabels(-45)
                .tickFormat(function (d) {
                    return moment(d).format("DD MMM");
                });

        chart.yAxis
                .axisLabel("Triggered")
                .tickFormat(d3.format('d'));

        var myData = [];
        var completedAgg = {
            values: [],
            key: "Sent",
            color: "#7777ff",
            area: true
        };

        var failedAgg = {
            values: [],
            key: "Failed",
            color: "#d9534f",
            area: true
        };

        myData.push(completedAgg);
        myData.push(failedAgg);

        var trueHits = (aggr !== null ? aggr.completed.createdDate.buckets : []);
        var falseHits = (aggr !== null ? aggr.failed.createdDate.buckets : []);

        for (var i = 0; i < trueHits.length; i++) {
            var bucket = trueHits[i];
            completedAgg.values.push(
                    {x: bucket.key, y: bucket.doc_count});
        }

        for (var i = 0; i < falseHits.length; i++) {
            var bucket = falseHits[i];
            failedAgg.values.push(
                    {x: bucket.key, y: bucket.doc_count});
        }

        d3.select('#chart_histogram svg')
                .datum(myData)
                .transition().duration(500)
                .call(chart);

        nv.utils.windowResize(chart.update);

        return chart;
    });
}