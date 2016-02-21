(function (w, t) {

    var searchOptions = {
        aggr: 'source',
        filters: null
    };

    function loadFunnel() {
        var data_url = w.location.pathname + "?asJson&" + $.param(searchOptions);

        t('div #funnel').funnel({
            url: data_url,
            stageHeight: "150px",
            stageNameFontSize: "14px",
            stageNameBackgroundColor: "gray",
            width: 400,
            height: 310,
            onData: function (resp) {
                flog("onData", resp.summary.aggregations.bydate.buckets);

                var summaryData = resp.summary.aggregations.bydate.buckets;

                var myData = [];
                var series = {
                    key: "Closed sales",
                    values: []
                };
                myData.push(series);

                $.each(summaryData, function (b, dateBucket) {
                    flog("aggValue", dateBucket);
                    var v = dateBucket.doc_count;
                    if (v == null) {
                        v = 0;
                    }
                    series.values.push({x: dateBucket.key, y: v});
                });


                nv.addGraph(function () {
                    var chart = nv.models.multiBarChart()
                            .reduceXTicks(true)   //If 'false', every single x-axis tick label will be rendered.
                            .rotateLabels(45)      //Angle to rotate x-axis labels.
                            .showControls(false)   //Allow user to switch between 'Grouped' and 'Stacked' mode.
                            .groupSpacing(0.1)    //Distance between each group of bars.
                            ;

                    chart.xAxis.tickFormat(function (d) {
                        return d3.time.format('%x')(new Date(d))
                    });

                    chart.yAxis.tickFormat(d3.format(',.2f'));


                    d3.select('#histo svg')
                            .datum(myData)
                            .call(chart);

                    nv.utils.windowResize(chart.update);

                    return chart;
                });
            },
            onBubbleClick: function (data, stage) {
                flog("onBubbleClick", data, stage.name);
                var name = data.name;
                if (data.id > 0) {
                    name = data.id;
                }
                //searchOptions.filters = (searchOptions.aggr + "=" + name);
                //loadFunnel();
                var uri = URI(window.location.pathname);
                var filters = searchOptions.aggr + "=" + name;
                uri.setSearch("filters", filters);
                uri.setSearch("stage", stage.name);
                history.pushState(null, null, uri.toString());
                $("#leadsContainer").reloadFragment({
                    url: uri.toString(),
                    whenComplete: function () {
                        initDataTable();
                    }
                });
            },
            onGroupClick: function (data, value) {
                flog("onGroupClick", data, value);
                var name = data.name;
                if (data.id > 0) {
                    name = data.id;
                }
                searchOptions.filters = (searchOptions.aggr + "=" + name);

                // Select an aggregation other then the selected filter
                var aggs = $(".btn-select-aggr");
                flog("aggs", aggs);
                var nextAgg = aggs.not("[href=" + searchOptions.aggr + "]").first();
                var newAggName = nextAgg.attr("href");
                flog("newAggName", newAggName);
                //searchOptions.aggr = newAggName;

                loadFunnel();

            }
        });
    }

    function initAggrSelect() {
        t('body').on('click', '.btn-select-aggr', function (e) {
            e.preventDefault();

            flog("clicked on", e.target);
            var btn = $(this);
            var title = btn.html();
            searchOptions.aggr = btn.attr('href');
            btn.closest('div').find('.aggr-title').html(title);

            loadFunnel();
        });
    }

    function initDataTable() {
        flog("initDataTable", $('#leadTable'));
        var dataTable = $('#leadTable').DataTable({
            paging: false
        });
    }

    w.initLeadManAnalytics = function () {
        loadFunnel();
        initAggrSelect();
        initDataTable();
    };
})(this, jQuery);