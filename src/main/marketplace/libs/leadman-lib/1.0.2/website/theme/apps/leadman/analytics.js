(function (w, t) {

    var searchOptions = {
        aggr: 'source',
        filters: null,
        stage: null
    };

    loadFunnel = function (url) {
        var data_url = url || w.location.pathname + "?asJson&" + $.param(searchOptions);

        flog('data_url', data_url);

        t('#kfvWrapper').funnel({
            url: data_url,
            stageHeight: "120px",
            stageNameFontSize: "14px",
            legendNameFontSize: '14px',
            stageNameBackgroundColor: "gray",
            width: 480,
            height: 260,
            marginLeft: 0,
            onData: function (resp) {
                initHistogram(resp);
                initPies(resp);
                initFunnelSource( t('#kfvWrapper'));
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
                flog("aggs", aggs, "filter out", searchOptions.aggr);
                var nextAgg = aggs.not("[href='" + searchOptions.aggr + "']").first();
                var newAggName = nextAgg.attr("href");
                flog("newAggName", newAggName);
                //searchOptions.aggr = newAggName;
                var uri = URI(window.location.pathname);
                var filters = searchOptions.aggr + "=" + name;
                uri.setSearch("filters", filters);
                history.pushState(null, null, uri.toString());

                loadFunnel();

            }
        });
    }

    function initHistogram(resp) {
        flog("initHistogram", resp.summary);
        $('#histo svg').empty();
        var closedSalesColor = $('#histo').attr('data-closedSales') || '#ee145b';
        var cancelledSalesColor = $('#histo').attr('data-cancelledSales') || '#3e3e3e';
        var closedBuckets = resp.summary.aggregations.closed.bydate.buckets;
        var cancelledBuckets = resp.summary.aggregations.cancelled.bydate.buckets;

        var myData = [];
        var closedSales = {
            key: "Closed sales",
            color: closedSalesColor,
            values: []
        };
        myData.push(closedSales);

        $.each(closedBuckets, function (b, dateBucket) {
            var v = dateBucket.doc_count;
            if (v == null) {
                v = 0;
            }
            closedSales.values.push({x: dateBucket.key, y: v});
        });

        var cancelledSales = {
            key: "Cancelled sales",
            color: cancelledSalesColor,
            values: []
        };
        myData.push(cancelledSales);
        $.each(cancelledBuckets, function (b, dateBucket) {
            var v = dateBucket.doc_count;
            if (v == null) {
                v = 0;
            }
            cancelledSales.values.push({x: dateBucket.key, y: v});
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
    }

    function initAggrSelect() {
        t('body').on('click', '.btn-select-aggr', function (e) {
            e.preventDefault();

            flog("clicked on", e.target);
            var btn = $(this);
            var title = btn.html();
            searchOptions.aggr = btn.attr('href');
            btn.closest('div').find('.aggr-title').html(title);
            $('#funnel-wrap').attr('aggr-title', title);
            loadFunnel();
        });
    }

    function initDataTable() {
        flog("initDataTable", $('#leadTable'));
        var dataTable = $('#leadTable').DataTable({
            paging: false
        });

        $("#funnel-lead-query").on({
            input: function () {
                typewatch(function () {
                    var text = $("#funnel-lead-query").val().trim();

                    dataTable.search(text).draw();
                }, 500);
            }
        });

    }

    function initPies(aggs) {
        var reasonsAgg = aggs.summary.aggregations.cancelledReasons.buckets;
        var closedByOrgAgg = aggs.summary.aggregations.closedByOrg.orgId.buckets;
        var lostByOrgAgg = aggs.summary.aggregations.lostByOrg.orgId.buckets;
        var colors = ['#ee145b','#3e3e3e','#4d9acc','#60b87e','#FF1493','#FF4500','#EE82EE','#ADFF2F','#FFDEAD','#F0FFFF','#FFF0F5','#DC143C','#FFC0CB'];
        flog("initPies", closedByOrgAgg);
        nv.addGraph(function () {
            var chartLost = nv.models.pieChart()
                    .x(function (d) {
                        return d.key;
                    })
                    .y(function (d) {
                        return d.doc_count
                    })
                    .donut(true)
                    .color(colors)
                    .showLabels(false);                
           

            d3.select("#lostReasonsPie svg")
                    .datum(reasonsAgg)
                    .transition().duration(1200)
                    .call(chartLost);

            var chartClosedByOrg = nv.models.pieChart()
                    .x(function (d) {
                        return d.orgTitle.hits.hits[0]._source.assignedToOrg.title;
                    })
                    .y(function (d) {
                        return d.doc_count;
                    })
                    .donut(true)
                    .color(colors)
                    .showLabels(false);   
            
            d3.select("#closedByOrgPie svg")
                    .datum(closedByOrgAgg)
                    .transition().duration(1200)
                    .call(chartClosedByOrg);

            var chartLostByOrg = nv.models.pieChart()
                    .x(function (d) {
                        return d.key;
                    })
                    .y(function (d) {
                        return d.doc_count;
                    })
                    .donut(true)
                    .color(colors)
                    .showLabels(false);   
            
            d3.select("#conversionRatePie svg")
                    .datum(lostByOrgAgg)
                    .transition().duration(1200)
                    .call(chartLostByOrg);

            return chartLost;
        });
    }

    function initFunnelSource(div){
        var fnSource = t('.funnel-source').clone().removeClass('hide');
        div.find('.funnel-labels').prepend(fnSource);
        fnSource.find('.aggr-title').text($('#funnel-wrap').attr('aggr-title'));
    }

    w.initLeadManAnalytics = function () {
        loadFunnel();
        initAggrSelect();
        initDataTable();
        $(w).bind('popstate', function (event) {
            var uri = new URI(w.location.pathname + w.location.search);
            uri.addQuery('asJson');

            flog('popstate', uri.toString());
            loadFunnel(uri.toString());
        });
    };
})(this, jQuery);