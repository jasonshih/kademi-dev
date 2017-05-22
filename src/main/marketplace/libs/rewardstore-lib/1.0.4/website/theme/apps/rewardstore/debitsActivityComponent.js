$(function () {
    // Parse JSON
    var jsonResp = $('.debits-activity').data("jsonresp");
    console.info("jsonResp", jsonResp);

    function initActivityChart(resp) {
        if ($('.debits-activity').length > 0) {
            nv.addGraph(function () {
                var chart = nv.models.multiBarChart()
                    .margin({top: 0, right: 0, bottom: 0, left: 0})
                    .showControls(false)
                    .showLegend(false)
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

                /* Generate data*/
                var debits = [];
                var myData = [
                    {
                        values: debits,
                        key: 'Debits',
                        color: '#2ca02c'
                    }
                ];

                if (resp.aggregations) {
                    var d = resp.aggregations;
                    var sBuckets = d.debits.dates.buckets;


                    for (var i = 0; i < sBuckets.length; i++) {
                        var b = sBuckets[i];
                        debits.push({
                            x: b.key,
                            y: b.sum.value || 0
                        });
                    }


                }

                debits.sort(dynamicSort('x'));

                d3.select('#rewardDebitsActivityChart-' + $('.debits-activity').data("bucketId") + ' svg')    //Select the <svg> element you want to render the chart in.
                    .datum(myData)         //Populate the <svg> element with chart data...
                    .call(chart);          //Finally, render the chart!

                //Update the chart when window resizes.
                nv.utils.windowResize(function () {
                    chart.update()
                });
                return chart;
            });
        }

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

    initActivityChart(jsonResp);
});