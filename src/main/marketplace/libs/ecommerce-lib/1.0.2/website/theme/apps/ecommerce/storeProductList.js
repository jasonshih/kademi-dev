(function ($) {
    $('#products-list-${prodsListId}').find('.btn-add-to-cart').off('click').on('click', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        var btn = $(this);
        var href = btn.attr('href');

        $.ajax({
            type: 'POST',
            url: '/storeCheckout',
            data: {
                addItemHref: href,
                addItemQuantity: 1
            },
            datatype: 'json',
            success: function () {
                Msg.info('Added item to shopping cart');
                $('#cart-link').reloadFragment();
            },
            error: function () {
                Msg.error('An error occured adding the product to your shopping cart. Please check your internet connection and try again');
            }
        });
    });
}(jQuery));