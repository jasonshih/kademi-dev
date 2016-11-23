(function ($) {
    var DEFAULT_PIECHART_OPTIONS = {
        startDate: null,
        endDate: null,
        xLabel: function (d, aggName) {
            var date = moment(d.key);
            var aggNameLower = aggName.toLowerCase();

            if (aggNameLower.indexOf('day') !== -1 || aggNameLower.indexOf('date') !== -1) {
                return date.format('MMMM Do YYYY');
            } else if (aggNameLower.indexOf('week') !== -1) {
                return 'Week #' + date.week() + ' ' + date.format('YYYY');
            } else if (aggNameLower.indexOf('month') !== -1) {
                return date.format('MMMM YYYY');
            } else {
                return d.key;
            }
        },
        legendPosition: 'top'
    };

    $.fn.pieChartAgg = function (options) {
        var containers = this;

        flog("pieChartAgg", containers);
        containers.each(function (i, n) {
            var cont = $(n);
            var config = $.extend({}, DEFAULT_PIECHART_OPTIONS, options);

            var queryHref = null;
            var graphOptions = {
                aggName: null,
                subAgg: null,
                showLegend: false
            };

            var component = cont.closest('[data-type^="component-"]');
            if (component.length > 0) {
                queryHref = "/queries/" + component.attr("data-query");
                graphOptions.aggName = component.attr("data-agg");
                graphOptions.showLegend = toBool(component.attr("data-legend"));
                config.legendPosition = component.attr("data-legend-position") || config.legendPosition;
            }

            $(document).on('pageDateChanged', function (e, startDate, endDate) {
                flog("piechart date change", graphOptions, cont, startDate, endDate);

                loadGraphData(queryHref, graphOptions, {
                    startDate: startDate,
                    endDate: endDate
                }, cont, config);
            });
        });
    };

    function loadGraphData(href, graphOptions, opts, container, config) {
        href = href + "?run&" + $.param(opts);

        flog("loadGraphData", container, graphOptions.aggName, href);
        $.ajax({
            type: "GET",
            url: href,
            dataType: 'json',
            success: function (resp) {
                showPieChart(resp, container, graphOptions, config);
            }
        });
    }

    function showPieChart(resp, container, graphOptions, config) {
        var aggr = resp.aggregations[graphOptions.aggName];
        var svg = container.find("svg");
        svg.empty();

        flog("showPieChart", aggr, svg);
        nv.addGraph(function () {
            var total = 0;
            for (var i in aggr.buckets) {
                var b = aggr.buckets[i];
                total += b.doc_count;
            }

            var chart = nv.models.pieChart()
                    .x(function (d) {
                        return config.xLabel(d, graphOptions.aggName);
                    })
                    .y(function (d) {
                        return d.doc_count;
                    })
                    .valueFormat(function (val) {
                        return round((val / total * 100), 2) + "% (" + val + ")";
                    })
                    .donut(true)
                    .labelType("percent")
                    .donutRatio(0.35)
                    .showLabels(true)
                    .showLegend(graphOptions.showLegend)
                    .legendPosition(config.legendPosition)
                    .margin({top: 0, right: 0, bottom: 0, left: 0});

            flog("select data", chart, svg.get(0));
            d3.select(svg.get(0))
                    .datum(aggr.buckets)
                    .transition().duration(350)
                    .call(chart);


            nv.utils.windowResize(chart.update);

            return chart;
        });
        flog("done show pieChart");
    }
    function toBool(v) {
        if (v === true) {
            return true;
        }
        var b = (v === 'true');
        return b;
    }
})(jQuery);
