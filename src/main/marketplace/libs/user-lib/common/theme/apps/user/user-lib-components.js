var dateOptions;

$(function () {
    $('.panel-registrations-over-time').each(function(i, n) {
            var graphOptions = {
                aggName: "registrations_over_time",
                subAgg: null,
                stacked: false,
                showControls: false,
                showLegend: false,
                left: 10,
                right: 10,
                bottom: 0,
                top: 0,
                dateFormat: "%e %b"
            };
            var queryHref = "/queries/registrationsOverTime";
            var cont = $(n);
            
            $(document).on('pageDateChanged', function (e, startDate, endDate) {
                loadGraphData(queryHref, graphOptions, {
                    startDate: startDate,
                    endDate: endDate
                }, cont);            
            });                       
    });
    
    function loadGraphData(href, graphOptions, opts, container) {
        if (!$.contains(document, container[0])) {
            return;
        }
        href = href + "?run";

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
                if (aggName){
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

            }

            flog("graph opts", graphOptions);
            var chart = null;
            if (graphOptions.type == 'line') {
                chart = nv.models.lineChart()
                    .margin({left: +graphOptions.left, right: +graphOptions.right, bottom: +graphOptions.bottom, top: +graphOptions.top})
                    .rightAlignYAxis(graphOptions.rightAlign)
                    .showLegend(graphOptions.showLegend)
                    .showYAxis(true)
                    .clipEdge(true);
            } else {
                chart = nv.models.multiBarChart()
                    .margin({left: +graphOptions.left, right: +graphOptions.right, bottom: +graphOptions.bottom, top: +graphOptions.top})
                    .rightAlignYAxis(graphOptions.rightAlign)
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
});
