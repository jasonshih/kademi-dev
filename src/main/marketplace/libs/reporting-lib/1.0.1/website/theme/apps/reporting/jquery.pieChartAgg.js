(function ($) {
    var DEFAULT_PIECHART_OPTIONS = {
        startDate: null,
        endDate: null,
        xLabel: function (d, aggName) {
            var date = moment(d.key);
            var aggNameLower = (aggName || '').toLowerCase();

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

        flog('pieChartAgg', containers);
        containers.each(function (i, n) {
            var cont = $(n);
            var config = $.extend({}, DEFAULT_PIECHART_OPTIONS, options);

            var queryHref = null;
            var graphOptions = {
                aggName: null,
                subAgg: null,
                showLegend: false,
                queryTable: false
            };

            var component = cont.closest('[data-type^=component-]');
            if (component.length > 0) {
                flog('Is pieChartComponent', component);
                var queryName = component.attr('data-query') || '';
                if (component.attr('data-query-type') === 'queryTable') {
                    graphOptions.queryTable = true;
                    queryHref = '/queries/' + queryName + '/?as=json';
                } else {
                    queryHref = '/queries/' + queryName.replace('.query.json', '') + '/?run';
                }
                graphOptions.aggName = component.attr('data-agg');
                graphOptions.showLegend = toBool(component.attr('data-legend'));
                graphOptions.showLegendValues = toBool(component.attr('data-legend-values'));
                config.legendPosition = component.attr('data-legend-position') || config.legendPosition;
                graphOptions.showLabels = toBool(component.attr('data-labels'));
                var dataColors = (component.attr('data-colors') || '').trim();
                if (dataColors !== '') {
                    config.colors = dataColors.split(',');
                }

                cont.css('height', '100%');
            }

            loadGraphData(queryHref, graphOptions, {}, cont, config);

            $(document).on('pageDateChanged', function (e, startDate, endDate) {
                flog('piechart date change', graphOptions, cont, startDate, endDate);

                loadGraphData(queryHref, graphOptions, {
                    startDate: startDate,
                    endDate: endDate
                }, cont, config);
            });
        });
    };

    function loadGraphData(href, graphOptions, opts, container, config) {
        href = href + $.param(opts);

        flog('loadGraphData', container, graphOptions.aggName, href);

        $.ajax({
            type: 'GET',
            url: href,
            dataType: 'json',
            success: function (resp) {
                flog('Response from server', resp);

                showPieChart(resp, container, graphOptions, config);
            }
        });
    }

    function showPieChart(resp, container, graphOptions, config) {
        var svg = container.find('svg');
        svg.empty();

        flog('showPieChart', svg);
        nv.addGraph(function () {
            var total = 0;
            var data = [];

            if (graphOptions.queryTable) {
                for (var i = 0; i < resp.headers.length; i++) {
                    data.push({
                        key: resp.headers[i],
                        doc_count: resp.rows[0][i]
                    });
                    total += resp.rows[0][i];
                }
            } else {
                var aggr = resp.aggregations[graphOptions.aggName];
                data = aggr.buckets;
                for (var i in data) {
                    var b = data[i];
                    total += b.doc_count;
                }
            }

            flog('Data to rendering pieChart', data);

            var chart = nv.models.pieChart()
                .x(function (d) {
                    if (graphOptions.showLegendValues){
                        return config.xLabel(d, graphOptions.aggName) + ' (' + d.doc_count + ')';
                    } else {
                        return config.xLabel(d, graphOptions.aggName);
                    }
                })
                .y(function (d) {
                    return d.doc_count;
                })
                .valueFormat(function (val) {
                    return round((val / total * 100), 2) + '% (' + val + ')';
                })
                .donut(true)
                .labelType('value')
                .donutRatio(0.35)
                .showLabels(graphOptions.showLabels)
                .labelThreshold(0.10)
                .showLegend(graphOptions.showLegend)
                .legendPosition(config.legendPosition)
                .margin({top: 0, right: 0, bottom: 0, left: 0});

            if (config.colors && config.colors.length > 0 && $.isArray(config.colors)) {
                chart.color(config.colors);
            }

            flog('select data', chart, svg.get(0));
            d3.select(svg.get(0))
                .datum(data)
                .transition().duration(350)
                .call(chart);

            nv.utils.windowResize(chart.update);

            return chart;
        });
        flog('done show pieChart');
    }

    function toBool(v) {
        if (v === true) {
            return true;
        }
        var b = (v === 'true');
        return b;
    }
})(jQuery);
