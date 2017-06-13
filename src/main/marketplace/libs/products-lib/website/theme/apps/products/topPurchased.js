$(function () {
    var panelTopPurchased = $('.panel-top-purchased-table');

    if (panelTopPurchased.length > 0) {
        flog('Init topPurchased panels', panelTopPurchased);

        $(document).on('pageDateChanged', function (e, startDate, endDate) {
            var uri = new URI(window.location.pathname + window.location.search);
            uri.addQuery('startDate', startDate);
            uri.addQuery('endDate', endDate);

            flog('Page date changed: ' + startDate + ' - ' + endDate);

            var newUrl = uri.toString();
            panelTopPurchased.reloadFragment({
                url: newUrl
            });
        });
    }
});