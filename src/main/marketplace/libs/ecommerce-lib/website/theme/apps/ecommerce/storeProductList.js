(function ($) {
    $(document).ready(function(){

        if($('.ecom-store-category-products').length > 0) {

            if($('.ecom-store-category-products.grid-layout')) {
                var win = $(window);
                var timer = null;

                win.on('resize', function () {
                    clearTimeout(timer);
                    timer = setTimeout(function () {
                        var brieves = $('#products-list-${prodsListId}').find('.product-brief');
                        brieves.css('height', '');

                        if (win.width() > 767) {
                            var heights = [];
                            brieves.each(function () {
                                heights.push($(this).innerHeight());
                            });

                            brieves.css('height', Math.max.apply(Math, heights));
                        }
                    }, 150);
                }).trigger('resize');
            }


            $('.products-list .btn-ecom-add-to-cart').off('click').on('click', function (e) {
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
        }
    });

}(jQuery));