(function (w) {
    var initImportButton = function () {
        var form = $("#importForm");
        form.forms({
            onSuccess: function () {
                form.find('button').prop('disabled', false);
                form.find('button .icn').removeClass('fa-spin');
                Msg.info("Completed import");
                updateAnalytics();
            },
            onValid: function () {
                form.find('button').prop('disabled', true);
                form.find('button .icn').addClass('fa-spin');
            }
        });
    };

    var options = {
        q: 'q',
        startDate: null,
        endDate: null
    };

    var updateAnalytics = function () {
        $.getJSON('/hoover/?' + $.param(options), function (data) {
            var aggrs = data.aggregations;
            var sources = aggrs.source.buckets;
            var websites = aggrs.websites.buckets;

            handleUrlTable(websites);
            handleTable(data.hits.hits);
            handleHistogram(sources);
        });
    };

    function handleUrlTable(websites) {
        var table = $('#urlTable');
        table.empty();

        if (websites.length < 1) {
            table.append('<tr><td colspan="4">No Data available</td></tr>');
        } else {
            for (var i in websites) {
                var website = websites[i];
                var urls = website.urls.buckets;
                for (var a in urls) {
                    var url = urls[a];
                    var t = '<tr>'
                            + '    <td>' + website.key + '</td>'
                            + '    <td>' + url.key + '</td>'
                            + '    <td>' + url.doc_count + '</td>'
                            + '</tr>';
                    table.append(t);
                }
            }
        }
    }

    function handleTable(hits) {
        var table = $('#hitsTable');
        table.empty();
        if (hits.length < 1) {
            table.append('<tr><td colspan="4">No Data available</td></tr>');
        } else {
            for (var i in hits) {
                var hit = hits[i]._source;
                var t = '<tr>'
                        + '    <td>' + hit.source + '</td>'
                        + '    <td>' + hit.type + '</td>'
                        + '    <td>' + (hit.commentText != null ? hit.commentText : '') + '</td>'
                        + '    <td>' + (new moment(hit.reqDate)).format('DD/MM/YYYY hh:mm') + '</td>'
                        + '</tr>';
                table.append(t);
            }
        }
    }

    function handleHistogram(aggr) {
        $('#chart_histogram svg').empty();
        nv.addGraph(function () {
            var chart = nv.models.multiBarChart()
                    .options({
                        showLegend: true,
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
                    .axisLabel("Triggered")
                    .tickFormat(d3.format('d'));

            var myData = [];

            for (var i in aggr) {
                var a = aggr[i];
                var typeAggr = a.type.buckets;

                for (var u in typeAggr) {
                    var ta = typeAggr[u];
                    var d = {
                        values: [],
                        key: a.key + ' - ' + ta.key,
                        area: true
                    };

                    var actAggr = ta.activity.buckets;

                    for (var o in actAggr) {
                        var aca = actAggr[o];
                        d.values.push({x: aca.key, y: aca.doc_count});
                    }

                    myData.push(d);
                }
            }

            d3.select('#chart_histogram svg')
                    .datum(myData)
                    .transition().duration(500)
                    .call(chart);

            nv.utils.windowResize(chart.update);

            return chart;
        });
    }

    function initReportDateRange() {
        var reportRange = $('#report-range');
        reportRange.exist(function () {
            flog("init report range");
            reportRange.daterangepicker({
                format: 'DD/MM/YYYY', // YYYY-MM-DD
                ranges: {
                    'Last 7 Days': [moment().subtract('days', 6), moment()],
                    'Last 30 Days': [moment().subtract('days', 29), moment()],
                    'This Month': [moment().startOf('month'), moment().endOf('month')],
                    'Last Month': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')],
                    'This Year': [moment().startOf('year'), moment()],
                },
            },
                    function (start, end) {
                        flog('onChange', start, end);
                        options.startDate = start.format('DD/MM/YYYY');
                        options.endDate = end.format('DD/MM/YYYY');
                        updateAnalytics();
                    }
            );
        });
    }

    w.initManageSocialImports = function () {
        initImportButton();
        initReportDateRange();
        updateAnalytics();
    };
})(this);