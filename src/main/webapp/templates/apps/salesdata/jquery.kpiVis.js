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

        loadKpiSeriesGraphData(kpiHref, options, container);
    };

})(jQuery);


function loadKpiSeriesGraphData(href, opts, container) {
    var href = href + "?activity&" + $.param(opts);
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
            handleKpiSeriesData(json, container);

        }
    });
}


function handleKpiSeriesData(resp, container) {
    var aggr = (resp !== null ? resp.aggregations : null);

    showKpiSeriesHistogram(aggr, container);
    showLeaderboard(aggr.leaders);
}

function showLeaderboard(leaderboardAgg) {
    flog("showLeaderboard", leaderboardAgg, leaderboardAgg.buckets);
    var tbody = $("#kpiLeaderboard");
    tbody.html("");
    $.each(leaderboardAgg.buckets, function(i, leader) {
        var tr = $("<tr>");
        tr.append("<td>#" + i + "</td>");
        var td = $("<td>");
        td.html( leader.key );
        tr.append(td);
        td = $("<td class='text-right'>");
        td.text( round(leader.metric.value,2) );
        tr.append(td);
        tbody.append(tr);
    } );
}

function showKpiSeriesHistogram(aggr, container) {
    flog("initKpiSeriesHistogram", aggr);
    var svg = container.find("svg");
    if( svg.length === 0) {
        svg = $("<svg>");
        container.append(svg);
    }

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

        d3.select(svg.get(0))
                .datum(myData)
                .call(chart);

        nv.utils.windowResize(chart.update);

        return chart;
    });
}
