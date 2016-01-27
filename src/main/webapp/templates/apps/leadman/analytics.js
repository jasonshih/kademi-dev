(function (w, t) {

    var searchOptions = {
        aggr: 'source',
        filters: null
    };

    function loadFunnel() {
        var data_url = w.location.pathname + "?asJson&" + $.param(searchOptions);

        t('div #funnel').funnel({
            url: data_url,
            onBubbleClick: function (data) {
                flog(data);
                searchOptions.filters = (searchOptions.aggr + "=" + data.name);
                loadFunnel();
            }
        });
    }

    function initAggrSelect() {
        t('body').on('click', '.btn-select-aggr', function (e) {
            e.preventDefault();

            var btn = $(this);
            var title = btn.html();
            searchOptions.aggr = btn.attr('href');

            btn.closest('div').find('.aggr-title').html(title);

            loadFunnel();
        });
    }

    w.initLeadManAnalytics = function () {
        loadFunnel();
        initAggrSelect();
    };
})(this, jQuery);