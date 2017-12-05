var dateOptions;

$(function () {
    flog('init query components');

    $('.query-data-histogram').dateAgg();
    $('.query-pie-chart').pieChartAgg();
    $('.query-table').queryTable();

    if (!$('.content-editor-page').length){
        $('.pageDatePicker').each(function () {
            var pageDatePicker = $(this);
            var cls = pageDatePicker.attr('data-style');
            var position = pageDatePicker.attr('data-position');
            var defaultRange = pageDatePicker.attr('data-default-range');
            var showNav = pageDatePicker.attr('data-show-nav') == 'true';
            if (!defaultRange){
                defaultRange = '7 days';
            }

            pageDatePicker.pageDatePicker({
                extraClass: cls,
                position: position,
                default: defaultRange,
                showNav: showNav
            });
        });
    }

    // TODO reporting components which need to update.. eg single value metric
    $(document.body).on('pageDateChanged', function (e, startDate, endDate) {
        $('[data-dynamic-href="_components/singleValue"]').reloadFragment({
            url: location.pathname + location.search
        });
    });
});
