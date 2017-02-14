(function ($) {
    function initDoSearch() {
        var searchForm = $('#searchForm');
        var tbody = $('#tbody-results');

        searchForm.on('submit', function (e) {
            e.preventDefault();
            e.stopPropagation();

            tbody.reloadFragment({
                url: window.location.pathname + "?" + searchForm.serialize()
            });
        });
    }

    // Run init Methods
    $(function () {
        initDoSearch();
    });
})(jQuery);