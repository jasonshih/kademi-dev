(function ($) {
    var DEFAULT_PIECHART_OPTIONS = {
        startDate: null,
        endDate: null,
        itemsPerPage: 100
    };

    $.fn.queryTable = function (options) {
        var container = this;

        flog("queryTable", container);
        container.each(function (i, n) {
            var cont = $(n);
            flog("init queryTable chart events", cont);
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
                flog("queryTable date change", e, startDate, endDate);

                loadGraphData(queryHref, aggName, {
                    startDate: startDate,
                    endDate: endDate
                }, cont, config);
            });

            cont.on('click', 'a', function (e) {
                e.preventDefault();

                var href = '/_components/queryTable';
//                var href = $(this).attr('href');                
//                if (href.indexOf('/_components/queryTable/') === -1) {
//                    href = '/_components/queryTable' + href;
//                }
                var query = cont.parents('[data-type=component-queryTable]').attr('data-query');
                var perPage = cont.parents('[data-type=component-queryTable]').attr('data-items-per-page');
                var height = cont.parents('[data-type=component-queryTable]').attr('data-height');
                href += '&data-query=' + encodeURI(query);
                href += '&data-items-per-page=' + encodeURI(perPage);
                href += '&data-height=' + encodeURI(height);
                
                var tbody = cont.find("tbody");
                tbody.reloadFragment({
                    url: href,
                    whenComplete: function (resp) {
                        comp.find('.panel-body').html($(resp).find('.panel-body').html());
                    }
                });
            });
        });
    };

})(jQuery);



