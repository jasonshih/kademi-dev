/**
 *  jquery.comments-1.0.4.js
 */

(function ($) {
    var DEFAULT_KPI_OPTIONS = {
        startDate: null,
        endDate: null,
        interval: "day",
        levelClassPrefix: null, // if provided, will add a class like label-success for levels called "success"
        levelClassSelector: null,
        levelClasses: null
    };

    $.fn.kpiVis = function (options) {
        var container = this;

        container.each(function (i, n) {
            var cont = $(n);
            var config = $.extend({}, DEFAULT_KPI_OPTIONS, options);

            var opts = {
                startDate: config.startDate,
                endDate: config.endDate,
                interval: config.interval
            };

            var kpiHref = cont.data("href");
            var visType = cont.data("visualisation");
            if (config.levelClassPrefix === null) {
                config.levelClassPrefix = cont.data("level-class-prefix");
            }
            if (config.levelClassSelector === null) {
                config.levelClassSelector = cont.data("level-class-selector");
            }
            if (config.levelClasses === null) {
                config.levelClasses = [];
                var s = cont.data("level-classes");
                if (s) {
                    var arr = s.split(",");
                    for (var i = 0; i < arr.length; i++) {
                        var pair = arr[i].split("=");
                        config.levelClasses[pair[0]] = pair[1];
                    }
                }
            }

            loadKpiSeriesGraphData(kpiHref, opts, cont, visType, config);
        });
    };

})(jQuery);


function loadKpiSeriesGraphData(href, opts, container, visType, config) {
    var href = href + "?dateHistogram&" + $.param(opts);
    flog("loadKpiSeriesGraphData", href);
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
            handleKpiSeriesData(json, container, visType, config);

        }
    });
}


function handleKpiSeriesData(resp, container, visType, config) {
    showKpiSeriesHistogram(resp, container, visType, config);

    // TODO: what do we do with this? callback with data?
    // ie config.onData(aggr), and the provided function renders the leaderboard .. ?
    var aggr = resp.aggregations;
    showLeaderboard(aggr.leaders);
}


function showLeaderboard(leaderboardAgg) {
    //flog("showLeaderboard", leaderboardAgg, leaderboardAgg.buckets);
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

function showKpiSeriesHistogram(resp, container, visType, config) {

    var aggr = resp.aggregations;

    var kpiTitle = resp.kpiTitle;
    container.find(".kpi-title").text(kpiTitle);

    var dataSeriesUnits = resp.units;

    container.find(".kpi-units").text(dataSeriesUnits);

    var overallMetric = aggr.metric.value;
    container.find(".kpi-metric").text(round(overallMetric, 0));

    flog("level pref", container, container.find("*[data-level-class-prefix]"));
    container.find("*[data-level-class-prefix]").each(function (i, n) {
        flog("level class prefi", n);
        var item = $(n);
        var levelClassPrefix = item.data("level-class-prefix");
        var levelClass = levelClassPrefix + resp.progressLevelName;
        flog("add class, ", levelClass);
        item.addClass(levelClass);
    });

    container.find("*[data-level-classes]").each(function (i, n) {
        var item = $(n);
        var sLevelClasses = item.data("level-classes");
        var levelClasses = [];
        var s = sLevelClasses;
        if (s) {
            var arr = s.split(",");
            for (var i = 0; i < arr.length; i++) {
                var pair = arr[i].split("=");
                levelClasses[pair[0]] = pair[1];
            }
            var c = levelClasses[resp.progressLevelName];
            item.addClass(c);
        }

    });

    container.find(".kpi-progress").text(round(resp.progressValue, 2));

    var levelTitle = resp.levelData[resp.progressLevelName].title;
    container.find(".kpi-level").text(levelTitle);

    container.find(".kpi-target").each(function (i, n) {
        var s = $(n);
        var levelName = s.data("level");
        var levelAmount = resp.levelData[levelName].lowerBound;
        s.text(round(levelAmount, 0));
    });


    var svg = container.find("svg");
    svg.empty();

    //flog("initKpiSeriesHistogram", resp, svg);

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
            if (v == null) {
                v = 0;
            }
            series.values.push({x: dateBucket.key, y: v});
        });



        var chart;
        //flog("myData", kpiTitle, myData);
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

        } else if (visType == "sparkline") {
            chart = nv.models.sparkline().height(100);
            chart.margin({right: 0, left: 0, bottom: 00, top: 0})
            chart.color(["#4caf50"]);
            myData = myData[0].values;
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

        }
    });
}

function round(value, decimals) {
    if (value) {
        return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
    } else {
        return "-";
    }
}