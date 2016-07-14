var dateOptions;

$(function () {
    flog('init query components');

    $('.query-data-histogram').dateAgg();
    $('.query-pie-chart').pieChartAgg();
    $('.query-table').queryTable();
    $('.pageDatePicker').each(function () {
        var pageDatePicker = $(this);
        var cls = pageDatePicker.attr('data-style');
        var position = pageDatePicker.attr('data-position');

        pageDatePicker.pageDatePicker({
            extraClass: cls,
            position: position
        });
    });
});
