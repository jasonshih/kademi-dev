$(function () {
    // Parse JSON
    $('.debits-activity').each(function () {
        var item = $(this);
        init(item);
    });

    function init(item) {
        var svg = item.find('svg');
        var jsonResp = svg.parent().data("jsonresp");
        svg.empty();

        initActivityChart(svg, jsonResp);
    }
    function initActivityChart(svg, resp) {
        nv.addGraph(function () {
            var chart = nv.models.multiBarChart()
                .margin({top: 0, right: 0, bottom: 0, left: 0})
                .showControls(false)
                .showLegend(true)
                .showYAxis(true)
                .showXAxis(true);

            chart.xAxis     //Chart x-axis settings
                .axisLabel('Date')
                .tickFormat(function (d) {
                    var rd = moment(d).format("DD MMM");
                    return rd;
                });

            chart.yAxis     //Chart y-axis settings
                .axisLabel('Count')
                .tickFormat(d3.format('.02f'));

            /* Generate data*/
            var debits = [];


            if (resp && resp.aggregations) {
                var d = resp.aggregations;
                var sBuckets = d.debits.dates.buckets;


                for (var i = 0; i < sBuckets.length; i++) {
                    var b = sBuckets[i];
                    debits.push({
                        x: b.key_as_string,
                        y: b.sum.value || 0
                    });
                }


            }

            debits.sort(dynamicSort('x'));

            var myData = [
                {
                    values: debits,
                    key: 'Debits',
                    color: '#2ca02c'
                }
            ];
            flog("[debitsActivity] select data", myData, chart, svg.get(0));

            d3.select(svg.get(0))    //Select the <svg> element you want to render the chart in.
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

    window.initDebitActivityChart = init;
});