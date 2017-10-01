(function () {

    function initUpdateStock() {
        $('body').on('click', '.adjustStock', function (e) {
            e.preventDefault();

            var btn = $(this);
            var row = btn.closest('tr');
            var href = row.data('href');
            var stock = row.data('stock');

            var newStock = prompt('Please enter new stock level', stock);

            if (newStock === null) {
                return;
            }

            var newStockInt = parseInt(newStock);
            $.ajax({
                url: href,
                type: 'POST',
                dataType: 'json',
                data: {
                    updateStock: newStockInt
                },
                success: function (resp) {
                    if (resp.status) {
                        Msg.success('Successfully updated stock level');
                        $('#productsTableContainer').reloadFragment();
                    } else {
                        Msg.error('Error updating stock level: ' + textStatus);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    Msg.error('Error updating stock level: ' + textStatus);
                }
            });
        });
    }

    // Run Init Functions
    $(function () {
        initUpdateStock();
    });
})();