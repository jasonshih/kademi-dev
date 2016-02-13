/**
 *  jquery.comments-1.0.4.js
 */

(function ($) {
    var DEFAULT_KPI_OPTIONS = {
        startDate: null,
        endDate: null,
        interval: "day"
    };

    $.fn.kpiVis = function (options) {
        var container = this;
        var config = $.extend({}, DEFAULT_KPI_OPTIONS, options);

        var kpiHref = container.data("href");
        var visType = container.data("visualisation");

        var options = {
            startDate: config.startDate,
            endDate: config.endDate,
            interval: config.interval
        };

        loadKpiSeriesGraphData(kpiHref, options, container, visType);
    };

})(jQuery);


function loadKpiSeriesGraphData(href, opts, container, visType) {
    var href = href + "?dateHistogram&" + $.param(opts);
    $.ajax({
        type: "GET",
        url: href,
        dataType: 'html',
        success: function (resp) {
            var json = null;

            if (resp !== null && resp.length > 0) {
                json = JSON.parse(resp);
            }

            flog('loadKpiData', href);
            handleKpiSeriesData(json, container, visType);

        }
    });
}


function handleKpiSeriesData(resp, container, visType) {
    showKpiSeriesHistogram(resp, container, visType);

    // TODO: what do we do with this? callback with data?
    // ie config.onData(aggr), and the provided function renders the leaderboard .. ?
    showLeaderboard(aggr.leaders);
}


function showLeaderboard(leaderboardAgg) {
    flog("showLeaderboard", leaderboardAgg, leaderboardAgg.buckets);
    var tbody = $("#kpiLeaderboard");
    tbody.html("");
    $.each(leaderboardAgg.buckets, function (i, leader) {
        var tr = $("<tr>");
        tr.append("<td>#" + i + "</td>");
        var td = $("<td>");
        td.html(leader.key);
        tr.append(td);
        td = $("<td class='text-right'>");
        td.text(round(leader.metric.value, 2));
        tr.append(td);
        tbody.append(tr);
    });
}

function showKpiSeriesHistogram(resp, container, visType) {
    flog("initKpiSeriesHistogram", resp);

    aggr = resp.aggregations;

    var kpiTitle = resp.kpiTitle;
    container.find(".kpi-name").text(kpiTitle);

    var dataSeriesUnits = resp.dataSeriesUnits;
    container.find(".kpi-units").text(dataSeriesUnits);

    var overallMetric = aggr.metric.value;
    container.find(".kpi-metric").text(round(overallMetric,2));


    var svg = container.find("svg");
    svg.empty();

    nv.addGraph(function () {

        var myData = [];
        var series = {
            key: "Sum",
            values: []
        };
        myData.push(series);

        $.each(aggr.periodFrom.buckets, function (b, dateBucket) {
            //flog("aggValue", dateBucket);
            var v = dateBucket.aggValue.value;
            if( v == null ) {
                v = 0;
            }
            series.values.push({x: dateBucket.key, y: v});
        });


        flog(myData);

        var chart;
        flog("visType", visType);
        if (visType === "dateHistogram") {
            chart = nv.models.multiBarChart()
                    .margin({right: 50, left: 0, bottom: 30, top: 0})
                    .rightAlignYAxis(true)      //Let's move the y-axis to the right side.
                    .showControls(true)       //Allow user to choose 'Stacked', 'Stream', 'Expanded' mode.
                    .clipEdge(true);

            chart.xAxis.tickFormat(function (d) {
                return d3.time.format('%x')(new Date(d))
            });

            chart.yAxis.tickFormat(d3.format(',.2f'));
            flog("using datehisto");
        } else if (visType == "sparkline") {
            chart = nv.models.sparkline().height(100);
            chart.margin({right: 0, left: 0, bottom: 00, top: 0})
            chart.color(["#4caf50"]);
            myData = myData[0].values;
            flog("using sparkline", myData);
        }

        chart.x(function (d) {
            return d.x;
        })
        chart.y(function (d) {
            return d.y;
        });


        d3.select(svg.get(0))
                .datum(myData)
                .call(chart);

        nv.utils.windowResize(chart.update);

        return chart;
    });
}

function round(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}