function initManageEmailHistory() {
    $('abbr.timeago').timeago();

    $("#email-query").keyup(function () {
        typewatch(function () {
            flog("do search");
            doSearch();
        }, 500);
    });

    $("#status").change(function () {
        typewatch(function () {
            flog("do search");
            doSearch();
        }, 100);
    });

    $("#job").change(function () {
        typewatch(function () {
            flog("do search");
            doSearch();
        }, 100);
    });


    $(document).on('pageDateChanged', function (e, startDate, endDate) {
        flog("page date changed", startDate, endDate);
        doSearch();
    });


    initSelectAll();
    initMarkIgnored();

    initRowTemplate();
    doSearch();
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
                        Msg.success(resp.messages);

                        checkBoxes.each(function (i, item) {
                            var a = $(item);
                            a.closest("tr").remove();
                        });

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


function doSearch() {
    flog("doSearch");

    var query = $("#email-query").val();
    var status = $("#status").val();
    var job = $("#job").val();
    
    var newURL = window.location.pathname + "?q=" + query + "&status=" + status + "&job=" + job
    var uri = new URI(newURL);
    window.history.pushState('', document.title, uri.toString());

    $.ajax({
        type: "GET",
        url: uri.toString() + "&emailStats",
        dataType: 'json',
        success: function (json) {
            flog('response', json);
            renderRows(json);
            initHistogram(json.aggregations);
            initPies(json.aggregations);
        }
    });
}

var template;

function initRowTemplate() {
    var templateHtml = $("#email-row-template").html();
    template = Handlebars.compile(templateHtml);
    Handlebars.registerHelper('dateFromLong', function (millis) {
        if (millis) {
            var date = new Date(millis[0]);
            return date.toISOString();
        } else {
            return "";
        }
    });
}

function renderRows(json) {
    flog("renderRows", json, template);
    var html = template(json);
    var container = $("#history-table-body");
    container.html(html);
    flog("do timeago", $(".timeago", container));
    container.find(".timeago").timeago();
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