(function ($) {
    var searchData = {
        startDate: null,
        endDate: null
    };

    function initReportDateRange() {
        $(document.body).on('pageDateChanged', function (e, startDate, endDate) {
            searchData.startDate = startDate;
            searchData.endDate = endDate;
            loadAnalytics();
        });
    }

    function loadAnalytics() {
        flog('Loading email analytics...');
        var href = "?analytics&" + $.param(searchData);
        $.ajax({
            type: "GET",
            url: href,
            dataType: 'html',
            success: function (resp) {
                var json = null;

                if (resp !== null && resp.length > 0) {
                    json = JSON.parse(resp);
                }

                flog('response', json);
                handleData(json);
            }
        });
    }

    function handleData(resp) {
        var aggr = (resp !== null ? resp.aggregations : null);

        initHistogram(aggr);
        initPies(aggr);
    }

    function initHistogram(aggr) {
        $('#chart_histogram svg').empty();
        nv.addGraph(function () {
            var chart = nv.models.multiBarChart()
                    .options({
                        showLegend: false,
                        showControls: false,
                        noData: "No Data available for histogram",
                        margin: {
                            left: 40,
                            bottom: 60
                        }
                    });

            chart.xAxis
                    .axisLabel("Date")
                    .rotateLabels(-45)
                    .tickFormat(function (d) {
                        return moment(d).format("DD MMM");
                    });

            chart.yAxis
                    .axisLabel("Sent")
                    .tickFormat(d3.format('d'));

            var myData = [];
            var createdDate = {
                values: [],
                key: "Created",
                color: "#7777ff",
                area: true
            };

            myData.push(createdDate);

            var createdBuckets = (aggr !== null ? aggr.createdDate.buckets : []);

            for (var i = 0; i < createdBuckets.length; i++) {
                var bucket = createdBuckets[i];
                createdDate.values.push(
                        {x: bucket.key, y: bucket.doc_count});
            }

            d3.select('#chart_histogram svg')
                    .datum(myData)
                    .transition().duration(500)
                    .call(chart);

            nv.utils.windowResize(chart.update);

            return chart;
        });
    }

    function initPies(aggr) {
        initPie("pieDevice", (aggr !== null ? aggr.deviceCategory : null));
        initPie("pieClient", (aggr !== null ? aggr.userAgentType : null));
        initPie("pieDomain", (aggr !== null ? aggr.domain : null));
    }

    function initPie(id, aggr) {
        flog("initPie", id, aggr);

        $('#' + id + ' svg').empty();
        nv.addGraph(function () {
            var chart = nv.models.pieChart()
                    .x(function (d) {
                        return d.key;
                    })
                    .y(function (d) {
                        return d.doc_count;
                    })
                    .donut(true)
                    .donutRatio(0.35)
                    .showLabels(true)
                    .showLegend(false)
                    .labelType("percent");

            var buckets = (aggr !== null ? aggr.buckets : []);

            d3.select("#" + id + " svg")
                    .datum(buckets)
                    .transition().duration(350)
                    .call(chart);

            return chart;
        });
    }

    $(function () {
        initReportDateRange();
    });
})(jQuery);