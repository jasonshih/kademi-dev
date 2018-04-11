$(function () {
    function reloadPointsTx() {
        var ids = [];
        $('.pointsTransactionTable').each(function () {
            var table = $(this);
            ids.push('#'+table.parent().attr('id'));
        });

        if (ids.length){
            var obj = $(ids.join(','));

            obj.reloadFragment();
        }
    }

    $(document).on('pageDateChanged', function () {
        reloadPointsTx();
    })
});