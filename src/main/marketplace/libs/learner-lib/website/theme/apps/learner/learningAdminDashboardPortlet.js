$(function () {

    function initActivityChart(resp) {
        nv.addGraph(function () {
            var chart = nv.models.lineChart()
                .margin({top: 0, right: 0, bottom: 0, left: 0})
                .useInteractiveGuideline(true)
                .showLegend(true)
                .showYAxis(false)
                .showXAxis(false);

            chart.interactiveLayer.tooltip.fixedTop(100);

            chart.xAxis     //Chart x-axis settings
                .axisLabel('Date')
                .tickFormat(function (d) {
                    return moment(d).format("DD MMM");
                });

            chart.yAxis     //Chart y-axis settings
                .axisLabel('Count')
                .tickFormat(d3.format('.02f'));

            /* Generate data*/
            var startedCount = 0;
            var completedCount = 0;

            var started = [];
            var completed = [];
            var myData = [
                {
                    values: started,
                    key: 'Started',
                    color: '#ff7f0e'
                },
                {
                    values: completed,
                    key: 'Completed',
                    color: '#2ca02c'
                }
            ];

            if (resp.status) {
                var d = resp.data.aggregations;
                var sBuckets = d.started.buckets;
                var cBuckets = d.completed.completedDate.buckets;

                /* generate started stats */
                for (var i in sBuckets) {
                    var b = sBuckets[i];
                    started.push({
                        x: b.key,
                        y: b.doc_count || 0
                    });
                    startedCount += b.doc_count || 0;
                }

                /* generate completed stats */
                for (var i in cBuckets) {
                    var b = cBuckets[i];
                    completed.push({
                        x: b.key,
                        y: b.doc_count || 0
                    });

                    completedCount += b.doc_count || 0;
                }
            }

            started.sort(dynamicSort('x'));
            completed.sort(dynamicSort('x'));

            $('#moduleStatsText').text(startedCount + ' Started / ' + completedCount + ' Completed');

            d3.select('#moduleActivityChart svg')    //Select the <svg> element you want to render the chart in.
                .datum(myData)         //Populate the <svg> element with chart data...
                .call(chart);          //Finally, render the chart!

            //Update the chart when window resizes.
            nv.utils.windowResize(function () {
                chart.update()
            });
            return chart;
        });
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


    $(document).ready(function(){
        if($('.learning-admin-dashboard').length > 0) {
            $(document.body).on('pageDateChanged', function (e, startDate, endDate, text) {
                $('.selected-range').text(text);
                $.get("/moduleActivityStats?startDate=" + startDate + '&finishDate=' + endDate, function (data) {
                    flog("moduleActivityStats", data);
                    initActivityChart(data);
                }, "json");
            });
        }
    });


});

