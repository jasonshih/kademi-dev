$(function () {
    $("body").on("click", ".select-product-option", function(e) {
        e.preventDefault();
        var link = $(e.target).closest("a");
        var optVal = link.attr("href");
        link.closest(".product-param").find("a.active").removeClass("active");
        link.addClass("active");
        link.closest(".product-param").data("opt-value", optVal);
        checkSelectedSku(link);
    });

    function checkSelectedSku(source) {
        // check availability, show price, etc
        var container = source.closest(".product-item");
        var selector = "";
        container.find(".product-param").each(function(i, n){
            var div = $(n);
            var paramName = div.data("param-name");
            var optVal = div.data("opt-value");
            selector += '[data-' + paramName + '="' + optVal + '"]';
            flog("options", paramName, optVal);
        });

        var sku = container.find("div" + selector);
        flog("selector", selector);
        flog("found sku", sku);
        if( sku.length > 0 ) {
            var price = sku.data("price");
            container.find(".product-price").text(price);
            container.find(".btn-ecom-add-to-cart").data("sku-id", sku.data("sku-id"));
            var lis = sku.find('ul').find('li');
            var kcom2inventory = container.find('#kcom2inventory');
            kcom2inventory.html('');
            if (lis.length){
                kcom2inventory.parent('').removeClass('hide');
            }
            lis.each(function () {
                var location = $(this).attr('data-location');
                var stock = $(this).attr('data-stock');
                kcom2inventory.append('<option value="'+location+'">'+location+', quantity available: '+stock+'</option>')
            });

            var slider =  $('#product-images.product-info');
            var gotoSlide = slider.find('.slickItem[data-sku-id='+sku.data("sku-id")+']').index();
            slider.slick('slickGoTo', gotoSlide);
        }

    }

//    if ($('.productParameterSelect').length) {
//        $('abbr.timeago').timeago();
//
//        $('.productParameterSelect').change(function () {
//            var optSelect = $(this);
//            flog('productParameterSelect changed', optSelect);
//            var uri = URI(window.location);
//            uri.setSearch(optSelect.attr('name'), optSelect.val());
//            var href = uri.toString();
//            flog('New uri', href);
//            history.pushState(null, null, href);
//
//            $('#product-images, #product-price, #btn-add-to-cart-wrapper, #product-actions').reloadFragment({
//                url: href
//            });
//        });
//    }

    /**
     * Created by Anh on 28/03/2017.
     */
    $(function () {
        function initSlickSlider(){
            var slider =  $('#product-images.product-info');
            var items = slider.find('.slickItem');
            if (slider.length) {
                slider.not('.slick-initialized').slick({
                    dots: false,
                    arrows: items.length > 1,
                    draggable: false,
                    infinite: true,
                    speed: 300,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    adaptiveHeight: true,
                    prevArrow:"<button type='button' class='slick-prev pull-left'><i class='fa fa-angle-left' aria-hidden='true'></i></button>",
                    nextArrow:"<button type='button' class='slick-next pull-right'><i class='fa fa-angle-right' aria-hidden='true'></i></button>",
                    // responsive: [
                    //     {
                    //         breakpoint: 1024,
                    //         settings: {
                    //             arrows: false,
                    //             slidesToShow: 3,
                    //             slidesToScroll: 3,
                    //         }
                    //     },
                    //     {
                    //         breakpoint: 768,
                    //         settings: {
                    //             arrows: false,
                    //             slidesToShow: 1,
                    //             slidesToScroll: 1,
                    //         }
                    //     }
                    // ]
                });
            }
        }
        initSlickSlider();
    });
});
