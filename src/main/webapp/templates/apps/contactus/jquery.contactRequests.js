(function ($) {
    var methods = {
        init: function (options) {
            var config = $.extend({
                "href": "/contactRequestSearch",
                "templateSource": $("#entry-template").html(),
                "templateFormSource": $("#forms-template").html()
            }, options);

            flog("init contactRequestSearch", config.templateSource);

            template = Handlebars.compile(config.templateSource);
            templateForms = Handlebars.compile(config.templateFormSource);

            Handlebars.registerHelper('dateFromLong', function (millis) {
                if (millis) {
                    var date = new Date(millis[0]);
                    return date.toISOString();
                } else {
                    return "";
                }
            });
            
            Handlebars.registerHelper("debug", function(optionalValue) {
                flog("Current Context");
                flog("====================");
                flog(this);

                if (optionalValue) {
                  flog("Value");
                  flog("====================");
                  flog(optionalValue);
                }
              });

            this.data("config", config);
        },
        load: function (explicitHref) {
            flog("load stream", this);
            var config = this.data("config");
            var container = this;
            var containerForms = $("#formsBody");
            var href = config.href;
            if (explicitHref) {
                href = explicitHref;
            }
            $.ajax({
                type: 'GET',
                url: href,
                dataType: 'json',
                success: function (resp) {
                    var html = template(resp);
                    container.html(html);
                    flog("template", container, html);
                    $(".timeago", container).timeago();
                    
                    var htmlForms = templateForms(resp);
                    containerForms.html(htmlForms);
                    
                    initCharts(resp);
                },
                error: function (resp) {
                    flog('error', resp);
                    Msg.error('err: couldnt load page data');
                }
            });
        }
    };

    $.fn.contactRequests = function (method) {
        flog("contactrequests", this);
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.stream');
        }
    };
})(jQuery);


// TODO: should generalise most of this and move this to a callback
function initCharts(resp) {
    flog("initCharts", resp);
    if (resp.aggregations) {
        var hitsBuckets = resp.aggregations.byDate.buckets;
        var formsBuckets = resp.aggregations.form.buckets;
        initHistogram(hitsBuckets);
        initFormsDonut(resp.hits.total, formsBuckets);
    }

}
function initHistogram(hits) {
    nv.addGraph(function () {
        var chart = nv.models.multiBarChart()
                .showControls(false)
//                .margin({left: 100})
//                .useInteractiveGuideline(true)
                .showLegend(false)
                .showYAxis(true)
                .showXAxis(true)
            ;

        chart.xAxis     //Chart x-axis settings
            .axisLabel('Date')
            .tickFormat(d3.format(',r'));

        chart.yAxis     //Chart y-axis settings
            .axisLabel('Hits');

        chart.xAxis
            .tickFormat(function (d) {
                return d3.time.format('%x')(new Date(d))
            });

        var myData = [];
        var series = {
            values: [],
            key: "Hits",
            color: "green"
        };
        myData.push(series);
        for (var i = 0; i < hits.length; i++) {
            var bucket = hits[i];
            series.values.push({x: bucket.key, y: bucket.doc_count});
        }


        flog("mydate", myData);

        d3.select('#visualisation')    //Select the <svg> element you want to render the chart in.
            .datum(myData)         //Populate the <svg> element with chart data...
            .call(chart);          //Finally, render the chart!

        //Update the chart when window resizes.
        nv.utils.windowResize(function () {
            chart.update()
        });
        return chart;
    });
}

function initFormsDonut(total, osBuckets) {
    nv.addGraph(function () {
        var chart = nv.models.pieChart()
                .x(function (d) {
                    //flog("x", d);
                    return d.key
                })
                .y(function (d) {
                    //flog("y", d);
                    return d.doc_count
                })
                .showLegend(false)
                .showLabels(false)     //Display pie labels
                .labelThreshold(.05)  //Configure the minimum slice size for labels to show up
                .labelType("percent") //Configure what type of data to show in the label. Can be "key", "value" or "percent"
                .donut(true)          //Turn on Donut mode. Makes pie chart look tasty!
                .title(total + "")
                .donutRatio(0.50)     //Configure how big you want the donut hole size to be.
            ;

        d3.select("#donutChart")
            .datum(osBuckets)
            .transition().duration(1500)
            .call(chart);

        return chart;
    });


}