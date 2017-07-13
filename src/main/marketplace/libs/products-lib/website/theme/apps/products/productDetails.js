
(function($){
    function doAddToCart(href) {
        $.ajax({
            type: 'POST',
            url: "/checkout",
            data: {
                addItemHref: href
            },
            datatype: "json",
            success: function (data) {
                Msg.info("Added item to shopping cart");
                $("#cart-link").reloadFragment();
            },
            error: function (resp) {
                Msg.error("An error occured adding the product to your shopping cart. Please check your internet connection and try again");
            }
        });
    }

    $(document).ready(function(){
        if($('.product-detail').length > 0) {
            $("abbr.timeago").timeago();
            $(".cart-add").click(function (e) {
                e.preventDefault();
                var target = $(e.target);
                var href = target.closest("a").attr("href");
                var params = target.closest(".addToCartContainer").find(".productParameterSelect").serialize();
                flog("params", params);
                href += "?" + params;
                flog("add item", href);
                doAddToCart(href);
            });
        }
    });
})(jQuery);