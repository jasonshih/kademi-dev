
var searchData = {
    startDate: null,
    endDate: null
}

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
                    doSearch(start, end);
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

    var href = "?emailStats&" + $.param(searchData);
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
    initPie("pieDevice", aggr.deviceCategory);
    initPie("pieClient", aggr.userAgentType);
    initPie("pieDomain", aggr.domain);
}
function initPie(id, aggr) {

    flog("initPie", id, aggr);

    $('#' + id + ' svg').empty();
    nv.addGraph(function () {
        var chart = nv.models.pieChart()
                .x(function (d) {
                    return d.key
                })
                .y(function (d) {
                    return d.doc_count
                })
                .donut(true)
                .donutRatio(0.35)
                .showLabels(true);


        d3.select("#" + id + " svg")
                .datum(aggr.buckets)
                .transition().duration(350)
                .call(chart);

        return chart;
    });
}
