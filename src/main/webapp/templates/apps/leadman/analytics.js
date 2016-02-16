(function (w, t) {

    var searchOptions = {
        aggr: 'source',
        filters: null
    };

    function loadFunnel() {
        var data_url = w.location.pathname + "?asJson&" + $.param(searchOptions);

        t('div #funnel').funnel({
            url: data_url,
            onBubbleClick: function (data, stage) {
                flog("onBubbleClick", data, stage.name);
                var name = data.name;
                if (data.id > 0) {
                    name = data.id;
                }
                //searchOptions.filters = (searchOptions.aggr + "=" + name);
                //loadFunnel();
                var uri = URI(window.location.pathname);
                var filters = searchOptions.aggr + "=" + name;
                uri.setSearch("filters", filters);
                uri.setSearch("stage", stage.name);
                history.pushState(null, null, uri.toString() );
                $("#leadsBody").reloadFragment({
                    url : uri.toString()
                });
            },
            onGroupClick : function(data, value) {
                flog("onGroupClick", data, value);
            }
        });
    }

    function initAggrSelect() {
        t('body').on('click', '.btn-select-aggr', function (e) {
            e.preventDefault();

            flog("clicked on", e.target);
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