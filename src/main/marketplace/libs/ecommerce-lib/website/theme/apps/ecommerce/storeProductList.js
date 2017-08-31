(function ($) {
    $(document).ready(function(){

        if($('.ecom-store-category-products').length > 0) {

            if($('.ecom-store-category-products.grid-layout')) {
                var win = $(window);
                var timer = null;

                win.on('resize', function () {
                    clearTimeout(timer);
                    timer = setTimeout(function () {
                        var brieves = $('.products-list').find('.product-brief');
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
        }
    });

}(jQuery));