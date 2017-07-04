/**
 *
 */

(function ($) {
    var DEFAULT_KPI_OPTIONS = {
        startDate: null,
        endDate: null,
        levelClassPrefix: null, // if provided, will add a class like label-success for levels called "success"
        levelClassSelector: null,
        levelClasses: null
    };

    $.fn.kpiTargetProgress = function (options) {
        var container = this;

        flog("init kpis target progress", container);
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
            var achivedLabel = cont.data("achivement-label");
            var selectedLevel = cont.data("level");

            var component = container.closest('[data-type^="component-kpiTargetProgress"]');

            if (component.length > 0) {
                kpiHref = component.data("href");
                visType = component.data("visualisation");
                achivedLabel = component.data("achivement-label");
                selectedLevel = component.data("level");
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

            $(document).on('pageDateChanged', function (e, startDate, endDate) {
                loadKpiTargetGraphData(kpiHref, opts, achivedLabel, selectedLevel, cont, config);
            });


            loadKpiTargetGraphData(kpiHref, opts, achivedLabel, selectedLevel, cont, config);
        });
    };

})(jQuery);


function loadKpiTargetGraphData(href, opts, achivedLabel, selectedLevel, container, config) {
    flog("loadKpiTargetGraphData");

    href = href + "?" + $.param(opts);
    var queryType = "kpiProgress";

    href += "&" + queryType;
    if (queryType === "pointsLeaderboard") {
        var max = container.data("max-records");
        if (max) {
            href += "&maxRecords=" + max;
        }
    }

    flog("loadKpiSeriesGraphData", container, queryType, href);
    $.ajax({
        type: "GET",
        url: href,
        dataType: 'json',
        success: function (resp) {
            flog("KPI data received", queryType, resp);
            flog("is date?", true);

            flog("show pie");
            showKpiSeriesPie(resp, container, achivedLabel, selectedLevel, config)
        }
    });
}

function showKpiSeriesPie(resp, container, achivedLabel, selectedLevel, config) {
    var aggr = resp.aggregations;
    var svg = container.find("svg");
    svg.empty();

    flog("showKpiSeriesPie", resp, svg);
    
    var level = resp.levelData[selectedLevel];

    var reasonsAgg = [
        {
            label: achivedLabel,
            value: aggr.metric.value
        },
        {
            label: "Remaining to " + level.title,
            value: (level.lowerBound - aggr.metric.value) < 0 ? 0 : level.lowerBound - aggr.metric.value
        }
    ];
    var colors = ['#ee145b', '#3e3e3e'];

    nv.addGraph(function () {
        var kpiProgressChart = nv.models.pieChart()
                .x(function (d) {
                    return d.label;
                })
                .y(function (d) {
                    return d.value;
                })
                .donut(true)
                .color(colors)
                .showLabels(false);


        d3.select(".panel-kpi-target-progress svg")
                .datum(reasonsAgg)
                .transition().duration(1200)
                .call(kpiProgressChart);

        return kpiProgressChart;
    });

    flog("done show pie");
}