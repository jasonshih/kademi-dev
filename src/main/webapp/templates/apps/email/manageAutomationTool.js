(function ($) {
    function initDoSearch() {
        var searchForm = $('#searchForm');
        var tbody = $('#tbody-results');
        var paginator = $('#paginator');

        searchForm.on('submit', function (e) {
            e.preventDefault();
            e.stopPropagation();

            var formParams = searchForm.serialize();

            window.history.pushState(null, null, window.location.pathname + "?" + formParams);

            tbody.reloadFragment({
                url: window.location.pathname + "?" + formParams,
                whenComplete: function () {
                    paginator.find('li a').each(function (i, item) {
                        var link = $(item);
                        var href = link.attr('href');
                        href = href + '&' + formParams;
                        link.attr('href', href);
                    });
                }
            });
        });

        var formParams = searchForm.serialize();
        $('#paginator').find('li a').each(function (i, item) {
            var link = $(item);
            var href = link.attr('href');
            href = href + '&' + formParams;
            link.attr('href', href);
        });
    }

    // Run init Methods
    $(function () {
        initDoSearch();
    });
})(jQuery);