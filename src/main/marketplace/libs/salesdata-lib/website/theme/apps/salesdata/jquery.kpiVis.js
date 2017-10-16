/**
 *
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
        
        flog("init kpis", container);
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
            
            var component = container.closest('[data-type^="component-kpiVis"]');
            if (component.length > 0) {
                kpiHref = component.data("href");
                visType = component.data("visualisation");
            }
            
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
            config.fillColor = [container.find('.fillColor').css('background-color')];
            
            $(document).on('pageDateChanged', function (e, startDate, endDate) {
                loadKpiSeriesGraphData(kpiHref, opts, cont, visType, config);
            });
            
            
            loadKpiSeriesGraphData(kpiHref, opts, cont, visType, config);
        });
    };
    
})(jQuery);


function loadKpiSeriesGraphData(href, opts, container, visType, config) {
    href = href + "?" + $.param(opts);
    var queryType = visType;
    if (queryType === "sparkline") {
        queryType = "dateHistogram";
    }
    href += "&" + queryType;
    if (queryType === "pointsLeaderboard") {
        var max = container.data("max-records");
        if (max) {
            href += "&maxRecords=" + max;
        }
    }
    
    flog("loadKpiSeriesGraphData", container, visType, href);
    $.ajax({
        type: "GET",
        url: href,
        dataType: 'json',
        success: function (resp) {
            flog("KPI data received", visType, resp);
            flog("is date?", visType == "dateHistogram");
            
            if (visType == "dateHistogram" || visType == "sparkline") {
                flog("show histo");
                showKpiSeriesHistogram(resp, container, visType, config);
            } else if (visType == "kpiLeaderboard") {
                showKpiLeaderboard(resp, container, visType, config);
            } else if (visType == "pointsLeaderboard") {
                showPointsLeaderboard(resp, container, visType, config);
            } else {
                showKpiSummary(resp, container, visType, config);
            }
        }
    });
}


function showPointsLeaderboard(resp, container, visType, config) {
    if (!resp.status) {
        flog("error in points leaderboard");
        return;
    }
    
    var tbody = container.find("tbody");
    flog("showPointsLeaderboard", tbody, resp.data);
    tbody.html("");
    
    
    $.each(resp.data, function (i, leader) {
        flog("leader", leader);
        var tr = $("<tr>");
        tr.append("<td>#" + i + "</td>");
        var td = $("<td>");
        td.html(leader.member.firstName + " " + leader.member.surName);
        tr.append(td);
        
        td = $("<td class='text-right'>");
        td.text(leader.numPoints);
        tr.append(td);
        
        td = $("<td class='text-right'>");
        td.text(round(leader.kpiAmount, 2));
        tr.append(td);
        
        tbody.append(tr);
    });
}

function showKpiLeaderboard(resp, container, visType, config) {
    var aggr = resp.aggregations;
    var leaderboardAgg = aggr.leaders;
    //flog("showLeaderboard", leaderboardAgg, leaderboardAgg.buckets);
    var tbody = container.find("tbody");
    flog("showLeaderboard", tbody, leaderboardAgg.buckets);
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

function showKpiSummary(resp, container, visType, config) {
    flog("showKpiSummary", resp);
    var aggr = resp.aggregations;
    
    var kpiTitle = resp.kpiTitle;
    flog("showKpiSummary", kpiTitle, container, container.find(".kpi-title"));
    container.find(".kpi-title").text(kpiTitle);
    
    var dataSeriesUnits = resp.units;
    
    container.find(".kpi-units").text(dataSeriesUnits);
    
    if (aggr && aggr.metric) {
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
        
        if (resp.levelData && resp.progressLevelName) {
            var levelTitle = resp.levelData[resp.progressLevelName].title;
            container.find(".kpi-level").text(levelTitle);
            container.find(".kpi-target").each(function (i, n) {
                var s = $(n);
                var levelName = s.data("level");
                var levelAmount = resp.levelData[levelName].lowerBound;
                s.text(round(levelAmount, 0));
            });
        }
    } else {
        flog("No aggregation found");
    }
}

function showKpiSeriesHistogram(resp, container, visType, config) {
    
    showKpiSummary(resp, container, visType, config);
    
    var aggr = resp.aggregations;
    var svg = container.find("svg");
    svg.empty();
    
    flog("initKpiSeriesHistogram", resp, svg);
    nv.addGraph(function () {
        
        var myData = [];
        var series = {
            key: "Sum",
            values: []
        };
        myData.push(series);
        
        $.each(aggr.periodFrom.buckets, function (b, dateBucket) {
            //flog("aggValue", dateBucket);
            var v = 0;
            if (dateBucket.aggValue && dateBucket.aggValue.value) {
                v = dateBucket.aggValue.value;
            }
            series.values.push({x: dateBucket.key, y: v});
        });
        
        
        var chart;
        //flog("myData", kpiTitle, myData);
        if (visType === "dateHistogram") {
            chart = nv.models.multiBarChart()
                .margin({right: 0, left: 0, bottom: 30, top: 0})
                .rightAlignYAxis(true)      //Let's move the y-axis to the right side.
                .showControls(false)       //Allow user to choose 'Stacked', 'Stream', 'Expanded' mode.
                .showLegend(false)
                .showYAxis(false)
                // .color(config.fillColor)
                .clipEdge(true);
            
            chart.xAxis.tickFormat(function (d) {
                return d3.time.format('%e %b')(new Date(d))
            });
            
            chart.yAxis.tickFormat(d3.format(',.2f'));
            
            chart.x(function (d) {
                return d.x;
            });
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
            chart.margin({right: 0, left: 0, bottom: 0, top: 0})
            chart.color(["#4caf50"]);
            myData = myData[0].values;
            chart.x(function (d) {
                return d.x;
            });
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
    flog("done show histo");
}

function round(value, decimals) {
    if (value) {
        return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
    } else {
        return "-";
    }
}