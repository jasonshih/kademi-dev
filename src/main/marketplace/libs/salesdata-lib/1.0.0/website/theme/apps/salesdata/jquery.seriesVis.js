/**
 *
 */

(function ($) {
    var DEFAULT_KPI_OPTIONS = {
        startDate: null,
        endDate: null,
        interval: "day",
        groupBy: null,
        dateChangeEvent : "pageDateChanged"
    };

    $.fn.seriesVis = function (options) {
        var container = this;
        var config = $.extend({}, DEFAULT_KPI_OPTIONS, options);

        var seriesHref = container.data("href");
        var visType = container.data("visualisation");
        var groupBy = container.data("group-by");
        var aggregation = container.data("aggregation");

        var options = {
            startDate: config.startDate,
            endDate: config.endDate,
            interval: config.interval,
            groupBy: groupBy,
            aggregation : aggregation
        };

        loadSeriesGraph(seriesHref, options, container, visType);
        
        $("body").on("pageDateChanged", function(e, startDate, endDate) {
            options.startDate = startDate;
            options.endDate = endDate;
            flog("update series graph", options);
            loadSeriesGraph(seriesHref, options, container, visType);
        });
    };

})(jQuery);


function loadSeriesGraph(href, opts, container, visType) {
    if( container.length == 0 ) {
        return ;
    }
    var href = href + "?dateHistogram&" + $.param(opts);
    var svg = container.find("svg");
    if (svg.length === 0) {
        svg = $("<svg></svg>");
        container.append(svg);
    }
    flog("loadSeriesGraph container=", container, " svg=", svg);

    $.ajax({
        type: "GET",
        url: href,
        dataType: 'html',
        success: function (resp) {
            var json = null;

            if (resp !== null && resp.length > 0) {
                json = JSON.parse(resp);
            }

            flog('loadSeriesGraph: response', json, svg, visType);
            handleSeriesData(json, svg, visType);

        }
    });
}


function handleSeriesData(resp, svg, visType) {
    flog("handleSeriesData", resp, svg, visType);
    var aggr = (resp !== null ? resp.aggregations : null);
    showSeriesHistogram(aggr, svg, visType);
}

function findVal(arr, key) {
    var val = null;
    $.each(arr, function (b, item) {
        if(item.key === key ) {
            val = item.aggValue.value;
        }
    });
    return val;
}

function showSeriesHistogram(aggr, svg, visType) {
    flog("showSeriesHistogram", aggr,svg, visType);

    svg.empty();
    nv.addGraph(function () {
        var myData = [];

        if (aggr.groupBy) {
            $.each(aggr.groupBy.buckets, function (i, groupBucket) {
                var series = {
                    key: groupBucket.key,
                    values: []
                };
                myData.push(series);
                $.each(aggr.periodFrom.buckets, function (b, dateBucket) {
                    var val = findVal(dateBucket.groupBy.buckets, groupBucket.key);
                    //flog("aggValue", dateBucket, val);
                    series.values.push({x: dateBucket.key, y: val});
                });

            });

            $.each(aggr.periodFrom.buckets, function (b, dateBucket) {
                //flog("aggValue", dateBucket);
                if (aggr.groupBy) {
                } else {
                    series.values.push({x: dateBucket.key, y: dateBucket.sum.value});
                }
            });

        } else {
            var series = {
                key: "Sum",
                values: []
            };
            myData.push(series);

            $.each(aggr.periodFrom.buckets, function (b, dateBucket) {
                //flog("aggValue", dateBucket);
                series.values.push({x: dateBucket.key, y: dateBucket.aggValue.value});
            });

        }


        flog(myData);

        var chart = nv.models.multiBarChart()
                .stacked(true)
                .margin({right: 50, left: 0, bottom: 15, top: 0})
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
