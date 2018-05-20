(function ($) {
    $(document).ready(function(){

        if($('.ecom-store-category-products.grid-layout').length > 0) {

                var win = $(window);
                var timer = null;

                win.on('resize', function () {
                    clearTimeout(timer);
                    timer = setTimeout(function () {
                        var brieves = $('.products-list').find('.product-brief');
                        var productTitles = $('.products-list').find('.product-title');
                        brieves.css('height', '');
                        productTitles.css('height', '');

                        if (win.width() > 767) {
                            var heights = [];
                            brieves.each(function () {
                                heights.push($(this).innerHeight());
                            });

                            brieves.css('height', Math.max.apply(Math, heights));

                            var heightTitles = [];
                            productTitles.each(function () {
                                heightTitles.push($(this).innerHeight());
                            });

                            productTitles.css('height', Math.max.apply(Math, heightTitles));
                        }
                    }, 150);
                }).trigger('resize');
        }
    });

}(jQuery));