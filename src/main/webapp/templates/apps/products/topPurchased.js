$(function () {
    var panelTopPurchased = $('.panel-top-purchased-table');

    if (panelTopPurchased.length > 0) {
        $(document).on('pageDateChanged', function (e, startDate, endDate) {
            var uri = new URI(window.location.pathname + window.location.search);
            uri.addQuery('startDate', startDate);
            uri.addQuery('finishDate', endDate);

            flog('Page date changed: ' + startDate + ' - ' + endDate);

            panelTopPurchased.reloadFragment({
                url: uri.toString()
            });
        });
    }
});