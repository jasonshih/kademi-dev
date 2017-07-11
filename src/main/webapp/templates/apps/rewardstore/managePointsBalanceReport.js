(function () {
    function doQuery() {
        $.ajax({
            url: '/reporting/_pointsBalanceQuery' + window.location.search,
            dataType: 'json',
            success: function (resp) {
                fog("Response _pointsBalanceQuery");
                flog(resp);
                if (resp.status) {
                    $('.no-data').hide();
                    handleData(resp.data);
                } else {
                    $('.no-data').show();
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                flog(textStatus, errorThrown);
                $('.no-data').show();
            }
        });
    }

    function handleData(data) {
        generateItems(data.hits.hits);
        generateHistogram(data.aggregations);
    }

    function generateItems(hits) {
        var source = $("#item-template").html();
        var template = Handlebars.compile(source);
        var html = template(hits);
        $('#items').html(html);
        $('.details-items-wrapper').show();
    }

    function generateHistogram(aggs) {
        nv.addGraph(function () {
            var chart = nv.models.multiBarChart()
                    .reduceXTicks(true)   //If 'false', every single x-axis tick label will be rendered.
                    .rotateLabels(0)      //Angle to rotate x-axis labels.
                    .showControls(true)   //Allow user to switch between 'Grouped' and 'Stacked' mode.
                    .groupSpacing(0.1)    //Distance between each group of bars.
                    ;

            chart.yAxis
                    .tickFormat(d3.format(',f'));

            var myData = [];

            for (var i in aggs) {
                if (i.startsWith('range_')) {
                    var pb = aggs[i];

                    var name = pb.meta.title;
                    if (!name || name.length === 0) {
                        name = pb.meta.name;
                    }

                    var pbData = {
                        values: [],
                        key: name,
                        color: stringToColorCode(pb.meta.name),
                        area: true
                    };

                    for (var a in pb.buckets) {
                        var b = pb.buckets[a];
                        pbData.values.push(
                                {
                                    x: b.key,
                                    y: b.doc_count
                                }
                        );
                    }

                    myData.push(pbData);
                }
            }

            d3.select('#histogram svg')
                    .datum(myData)
                    .call(chart);

            nv.utils.windowResize(chart.update);

            return chart;
        });
    }

    var color_codes = {};

    function stringToColorCode(str) {
        var hash = djb2(str);
        var r = (hash & 0xFF0000) >> 16;
        var g = (hash & 0x00FF00) >> 8;
        var b = hash & 0x0000FF;
        return (str in color_codes) ? color_codes[str] : (color_codes[str] = "#" + ("0" + r.toString(16)).substr(-2) + ("0" + g.toString(16)).substr(-2) + ("0" + b.toString(16)).substr(-2));
    }

    function djb2(str) {
        var hash = 5381;
        for (var i = 0; i < str.length; i++) {
            hash = ((hash << 5) + hash) + str.charCodeAt(i);
        }
        return hash;
    }

    $(function () {
        Handlebars.registerHelper('generatePb', function (points) {
            var result = '';

            for (var a in points) {
                var pb = points[a];
                for (var i in pb) {
                    result += "<b>" + i + "</b>" + ': ' + pb[i] + '</br>';
                }
            }

            if (result.endsWith('</br>')) {
                result = result.substring(0, result.lastIndexOf('</br>'));
            }

            return new Handlebars.SafeString(result);
        });

        doQuery();
    });
})();