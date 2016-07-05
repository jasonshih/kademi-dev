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
        var container = this;

        flog("pieChartAgg", container);
        container.each(function (i, n) {
            var cont = $(n);
            flog("init pie chart events", cont);
            var config = $.extend({}, DEFAULT_PIECHART_OPTIONS, options);

            var opts = {
                startDate: config.startDate,
                endDate: config.endDate
            };

            $(document).on('pageDateChange', function () {
                flog("piechart date change");
            });            

            var queryHref = null;
            var aggName = null;
            var component = container.closest('[data-type^="component-"]');
            if (component.length > 0) {
                queryHref = "/queries/" + component.attr("data-query");
                aggName = component.attr("data-agg");
                flog("pieChart params", queryHref, aggName, component);

                config.legendPosition = component.attr("data-legend-position") || config.legendPosition;
            }
            loadGraphData(queryHref, aggName, opts, cont, config);
        });
    };


    function loadGraphData(href, aggName, opts, container, config) {
        href = href + "?run&" + $.param(opts);

        flog("loadGraphData", container, aggName, href);
        $.ajax({
            type: "GET",
            url: href,
            dataType: 'json',
            success: function (resp) {
                showPieChart(resp, container, aggName, config);
            }
        });
    }

    function showPieChart(resp, container, aggName, config) {
        var aggr = resp.aggregations[aggName];
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
                        return config.xLabel(d, aggName);
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
                    .showLegend(true)
                    .legendPosition(config.legendPosition);

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

})(jQuery);
