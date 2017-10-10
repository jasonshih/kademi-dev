(function ($) {
    var DEFAULT_POINTS_ACTIVITY_OPTIONS = {};

    $.fn.pointsActivityChart = function (options) {
        var containers = this;

        flog('pointsActivityChart', containers);
        containers.each(function (i, n) {
            var container = $(n);
            var config = $.extend({}, DEFAULT_POINTS_ACTIVITY_OPTIONS, options);
            var queryHref = null;

            var component = container.closest('[data-type^=component-]');
            if (component.length > 0) {
                flog('Is pointsActivityComponent', component);
                queryHref = component.attr('data-bucket');
                config.days = +component.attr('data-days');
            }

            loadGraphData(queryHref, {}, container, config);

            $(document).on('pageDateChanged', function (e, startDate, endDate) {
                flog('piechart date change', container, startDate, endDate);

                loadGraphData(queryHref, {
                    startDate: startDate,
                    endDate: endDate
                }, container, config);
            });
        });
    };

    function loadGraphData(pointsBucketName, opts, container, config) {
        href = '/queries/rewards-points-activity-' + pointsBucketName + '?run';
        href = href + '&' + $.param(opts);

        flog('loadGraphData', container, href);

        $.ajax({
            type: 'GET',
            url: href,
            dataType: 'json',
            success: function (resp) {
                flog('Response from server', resp);

                showPointsActivityChart(resp, container, config);
            }
        });
    }

    function showPointsActivityChart(resp, container, config) {
        var svg = container.find('svg');
        svg.empty();

        flog('start show pointsActivityChart', svg);
        nv.addGraph(function () {
            var chart;

            try {
                chart = nv.models.multiBarChart()
                        .margin({top: 0, right: 0, bottom: 0, left: 0})
                        .showControls(false)
                        .showLegend(true)
                        .showYAxis(false)
                        .showXAxis(false);

                chart.xAxis     //Chart x-axis settings
                        .axisLabel('Date')
                        .tickFormat(function (d) {
                            return moment(d).format("DD MMM");
                        });

                chart.yAxis     //Chart y-axis settings
                        .axisLabel('Count')
                        .tickFormat(d3.format('.02f'));

                /* Generate data */
                var active = [];
                var expired = [];
                var myData = [
                    {
                        values: active,
                        key: 'Awarded',
                        color: '#2ca02c'
                    },
                    {
                        values: expired,
                        key: 'Expired',
                        color: '#d9534f'
                    }
                ];

                if (resp.aggregations) {
                    var d = resp.aggregations;
                    var sBuckets = d.awarded.dates.buckets;
                    var cBuckets = d.expired.dates.buckets;

                    flog('Awarded Buckets', sBuckets);
                    flog('Expired Buckets', cBuckets);

                    /* generate valid stats */
                    for (var i in sBuckets) {
                        var b = sBuckets[i];
                        active.push({
                            x: b.key,
                            y: b.sum ? b.sum.value || 0 : 0
                        });
                    }

                    /* generate expired stats */
                    for (var i in cBuckets) {
                        var b = cBuckets[i];
                        expired.push({
                            x: b.key,
                            y: b.sum ? b.sum.value || 0 : 0
                        });
                    }
                }

                active.sort(dynamicSort('x'));
                expired.sort(dynamicSort('x'));

                d3.select(svg.get(0))
                        .datum(myData)
                        .call(chart);

                // Update the chart when window resizes.
                nv.utils.windowResize(function () {
                    chart.update();
                });
            } catch (e) {
                flog('Error when rendering pointsActivityChart: ' + e, e);
            }

            return chart;
        });

        flog('done show pointsActivityChart');
    }

    function dynamicSort(property) {
        var sortOrder = 1;
        if (property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a, b) {
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        };
    }

    $(function () {
        $('[data-type="component-pointsActivity"]').pointsActivityChart();
    });
})(jQuery);
