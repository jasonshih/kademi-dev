/**
 *
 */

(function ($) {
    var DEFAULT_KPI_OPTIONS = {
        startDate: null,
        endDate: null,
        interval: "day"
    };

    $.fn.dateAgg = function (options) {
        var containers = this;

        containers.each(function (i, n) {
            var cont = $(n);
            var config = $.extend({}, DEFAULT_KPI_OPTIONS, options);

            var queryHref = null;
            var queryType = null;
            var graphOptions = {
                aggName: null,
                subAgg: null,
                stacked: false,
                showControls: false,
                showLegend: false
            };

            var component = cont.closest('[data-type^="component-"]');
            if (component.length > 0) {
                queryHref = "/queries/" + component.attr("data-queryname");
                queryType = component.attr("data-querytype");
                graphOptions.aggName = component.attr("data-agg");
                graphOptions.subAgg = component.attr("data-sub-agg");
                graphOptions.metricAgg = component.attr("data-metric-agg");
                graphOptions.type = component.attr('data-chart-type');
                graphOptions.dateFormat = component.attr('data-date-format') || "%e %b";
                graphOptions.valueFormat = component.attr('data-value-format') || ",.2f";
                graphOptions.colors = component.attr('data-colors');
                graphOptions.stacked = toBool(component.attr("data-stacked"));
                graphOptions.showControls = toBool(component.attr("data-controls"));
                graphOptions.showLegend = toBool(component.attr("data-legend"));

                if (graphOptions.colors){
                    var colors = graphOptions.colors.split(',');
                    for(var i = 0; i < colors.length; i++){
                        colors[i] = colors[i].trim();
                    }
                    graphOptions.userColors = colors;
                }
            }
            flog("graphopts1", graphOptions.stacked, component, component.attr("data-stacked"));

            $(document).on('pageDateChanged', function (e, startDate, endDate) {
                flog("dateAgg: page date changed", cont);
                if (queryType === 'query'){
                    loadGraphData(queryHref, graphOptions, {
                        startDate: startDate,
                        endDate: endDate
                    }, cont);
                } else if (queryType === 'queryTable'){
                    loadGraphDataQueryTable(queryHref, graphOptions, {
                        startDate: startDate,
                        endDate: endDate
                    }, cont);
                }

            });

            // Wait for event to be triggered
            //loadGraphData(queryHref, aggName, opts, cont, config);
        });
    };


    function loadGraphData(href, graphOptions, opts, container) {
        if (!$.contains(document, container[0])) {
            return;
        }
        href = href + "?run&" + $.param(opts);

        flog("loadGraphData", container, graphOptions, href);
        $.ajax({
            type: "GET",
            url: href,
            dataType: 'json',
            success: function (resp) {
                showHistogram(resp, container, graphOptions);
            }
        });
    }

    function loadGraphDataQueryTable(href, graphOptions, opts, container){
        if (!$.contains(document, container[0])) {
            return;
        }
        href = href + "?as=json&" + $.param(opts);

        flog("loadGraphDataQueryTable", container, graphOptions, href);
        $.ajax({
            type: "GET",
            url: href,
            dataType: 'json',
            success: function (resp) {
                showHistogramQueryTable(resp, container, graphOptions);
            }
        });
    }

    function showHistogramQueryTable(resp, container, graphOptions) {
        var svg = container.find("svg");
        svg.empty();

        flog("showHistogram", svg);
        nv.addGraph(function () {

            var myData = [];

            if (resp.headers && resp.headers.length){
                for (var i = 1; i < resp.headers.length; i++){
                    var series = {key: resp.headers[i], values: []};
                    for (var j = 0; j < resp.rows.length; j++){
                        var value = resp.rows[j][i];
                        flog("value", value, "x", resp.rows[j][0]);
                        series.values.push({x: resp.rows[j][0], y: value});
                    }

                    myData.push(series);
                }
            }

            flog("graph opts", graphOptions);
            var chart = null;
            if (graphOptions.type == 'line') {
                chart = nv.models.lineChart()
                    .margin({right: 50, left: 0, bottom: 30, top: 0})
                    .rightAlignYAxis(true)      //Let's move the y-axis to the right side.
                    .showLegend(graphOptions.showLegend)
                    .showYAxis(true)
                    .clipEdge(true);
            } else {
                chart = nv.models.multiBarChart()
                    .margin({right: 50, left: 0, bottom: 30, top: 0})
                    .rightAlignYAxis(true)      //Let's move the y-axis to the right side.
                    .showControls(graphOptions.showControls)       //Allow user to choose 'Stacked', 'Stream', 'Expanded' mode.
                    .showLegend(graphOptions.showLegend)
                    .stacked(graphOptions.stacked)
                    .showYAxis(true)
                    .clipEdge(true);
            }
            if (graphOptions.userColors){
                chart.color(graphOptions.userColors);
            }

            chart.xAxis.tickFormat(function (d) {
                return d3.time.format(graphOptions.dateFormat)(new Date(d))
            });

            chart.yAxis.tickFormat(d3.format(graphOptions.valueFormat));

            chart.x(function (d) {
                return d.x;
            });
            chart.y(function (d) {
                return d.y;
            });


            flog("select data", myData, chart, svg.get(0));
            d3.select(svg.get(0))
                .datum(myData)
                .call(chart);

            nv.utils.windowResize(chart.update);

            return chart;
        });
        flog("done show histo");
    }

    function showHistogram(resp, container, graphOptions) {

        var aggName = graphOptions.aggName;
        var subAgg = graphOptions.subAgg;
        var metricAgg = graphOptions.metricAgg;

        var aggr = resp.aggregations[aggName];
        var svg = container.find("svg");
        svg.empty();

        flog("showHistogram", aggr, subAgg, svg);
        nv.addGraph(function () {

            var myData = [];
            if (subAgg) {
                var mapOfSeries = [];
                $.each(aggr.buckets, function (b, dateBucket) {
                    // Iterate over all date buckets, and create a series for each bucket in the subagg
                    var sagg = dateBucket[subAgg];
                    $.each(sagg.buckets, function (b, subAggBucket) {
                        var series = mapOfSeries[subAggBucket.key];
                        if (series) {
                        } else {
                            var series = {
                                key: subAggBucket.key,
                                values: []
                            };
                            myData.push(series);
                            mapOfSeries[series.key] = series;
                        }
                    });
                });

                $.each(aggr.buckets, function (b, dateBucket) {
                    // Iterate over each series and attempt to locate a value
                    var sagg = dateBucket[subAgg];
                    $.each(myData, function (b, series) {
                        var subAggBucket = findBucket(sagg.buckets, series.key);
                        var v = 0;
                        if (subAggBucket) {
                            v = findValue(subAggBucket, graphOptions);
                        }
                        //flog("subAgg", subAgg, "date=", dateBucket.key, "v=", v);
                        series.values.push({x: dateBucket.key, y: v});
                    });

                });
            } else {
                var series = {
                    key: aggName,
                    values: []
                };
                myData.push(series);

                $.each(aggr.buckets, function (b, dateBucket) {
                    var v = findValue( dateBucket, graphOptions );
                    series.values.push({x: dateBucket.key, y: v});
                });
            }

            flog("graph opts", graphOptions);
            var chart = null;
            if (graphOptions.type == 'line') {
                chart = nv.models.lineChart()
                        .margin({right: 50, left: 0, bottom: 30, top: 0})
                        .rightAlignYAxis(true)      //Let's move the y-axis to the right side.
                        .showLegend(graphOptions.showLegend)
                        .showYAxis(true)
                        .clipEdge(true);
            } else {
                chart = nv.models.multiBarChart()
                        .margin({right: 50, left: 0, bottom: 30, top: 0})
                        .rightAlignYAxis(true)      //Let's move the y-axis to the right side.
                        .showControls(graphOptions.showControls)       //Allow user to choose 'Stacked', 'Stream', 'Expanded' mode.
                        .showLegend(graphOptions.showLegend)
                        .stacked(graphOptions.stacked)
                        .showYAxis(true)
                        .clipEdge(true);
            }
            if (graphOptions.userColors){
                chart.color(graphOptions.userColors);
            }

            chart.xAxis.tickFormat(function (d) {
                return d3.time.format(graphOptions.dateFormat)(new Date(d))
            });

            chart.yAxis.tickFormat(d3.format(graphOptions.valueFormat));

            chart.x(function (d) {
                return d.x;
            });
            chart.y(function (d) {
                return d.y;
            });


            flog("select data", myData, chart, svg.get(0));
            d3.select(svg.get(0))
                    .datum(myData)
                    .call(chart);

            nv.utils.windowResize(chart.update);

            return chart;
        });
        flog("done show histo");
    }

    function findValue(bucket, options) {
        var v;
        if( options.metricAgg ) {
            var agg = bucket[options.metricAgg];
            if( agg ) {
                v = agg.value;
            }
        } else {
            v = bucket.doc_count;
        }
        if (v == null) {
            v = 0;
        }
        return v;
    }

    function findBucket(buckets, key) {
        for (var i = 0; i < buckets.length; i++) {
            var bucket = buckets[i];
            if (bucket.key == key) {
                return bucket;
            }
        }
        return null;
    }

    function toBool(v) {
        if (v === true) {
            return true;
        }
        var b = (v === 'true');
        return b;
    }

    $(function(){
        var panels = $(".panel-date-histogram");
        panels.dateAgg();
    })
})(jQuery);
