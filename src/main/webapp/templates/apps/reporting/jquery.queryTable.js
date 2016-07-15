(function ($) {
    var DEFAULT_PIECHART_OPTIONS = {
        startDate: null,
        endDate: null,
        itemsPerPage: 100
    };

    $.fn.queryTable = function (options) {
        var container = this;

        flog("pieChartAgg", container);
        container.each(function (i, n) {
            var cont = $(n);
            flog("init pie chart events", cont);
            var config = $.extend({}, DEFAULT_PIECHART_OPTIONS, options);

            var opts = {
                startDate: config.startDate,
                endDate: config.endDate
            };

            $(document).on('pageDateChange', function () {
                flog("piechart date change");
            });

            var queryHref = null;
            var aggName = null;
            var component = container.closest('[data-type^="component-"]');
            if (component.length > 0) {
                queryHref = "/queries/" + component.attr("data-query");
                aggName = component.attr("data-agg");
                flog("pieChart params", queryHref, aggName, component);

                config.legendPosition = component.attr("data-legend-position") || config.legendPosition;
            }

            $(document).on('pageDateChanged', function (e, startDate, endDate) {
                flog("piechart date change", e, startDate, endDate);

                loadGraphData(queryHref, aggName, {
                    startDate: startDate,
                    endDate: endDate
                }, cont, config);
            });
        });
    };

})(jQuery);
