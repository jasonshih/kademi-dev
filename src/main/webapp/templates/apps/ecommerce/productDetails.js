function initProductDetails() {
    initProductParameters();
    initAddToCart();
}

function initProductParameters() {
    $(".productParameterSelect").change(function (e) {
        var optSelect = $(this);
        flog("productParameterSelect changed", optSelect);
        var uri = URI(window.location);
        uri.setSearch(optSelect.attr("name"), optSelect.val());
        flog("New uri", uri.toString());
        history.pushState(null, null, uri.toString());
        $("#addToCartSection").reloadFragment({
            url: uri.toString()
        });
    });
}

function initAddToCart() {
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

function doAddToCart(href) {
    $.ajax({
        type: 'POST',
        url: "/storeCheckout",
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