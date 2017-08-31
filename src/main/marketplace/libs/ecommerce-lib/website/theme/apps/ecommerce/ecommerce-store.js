(function ($) {
    function onWindowStopResize(callback) {
        var timer = null;
        var win = $(window);

        win.on('resize', function () {
            clearTimeout(timer);
            timer = setTimeout(function () {
                if (typeof callback === 'function') {
                    callback.call(this, win);
                }
            }, 200);
        }).trigger('resize');
    }

    function initAddToCartForProductList() {
        flog('initAddToCartForProductList');

        var productsList = $('#products-list,.products-list');
        productsList.on('click', '.btn-ecom-add-to-cart', function (e) {
            e.preventDefault();

            var btn = $(this);
            var href = btn.attr('href');

            getOrderForm(href, function (orderForm) {
                if (!orderForm) {
                    doAddToCart(href);
                } else {
                    showOrderForm(href, orderForm);
                }
            });
        });
    }

    function getOrderForm(href, callback) {
        var link = href;
        if (!link.contains("?")) {
            link += "?"
        } else {
            link += "&";
        }
        link += "getOrderForm";
        $.ajax({
            type: 'GET',
            url: link,
            dataType: 'json',
            success: function (data) {
                flog("getorderform response", data);
                if (data.status) {
                    callback(data.data);
                } else {
                    flog("No order form");
                    callback(null);
                }
            },
            error: function (resp) {
                Msg.error('An error occured checking for an order form');
            }
        });
    }

    function showOrderForm(href, orderForm) {
        createModal("orderForm", href, "Enter fields", orderForm);
    }

    function doAddToCart(href, quantity) {
        if (isNaN(quantity)) {
            quantity = 1;
        }

        $.ajax({
            type: 'POST',
            url: '/storeCheckout',
            data: {
                addItemHref: href,
                addItemQuantity: quantity
            },
            datatype: 'json',
            success: function (data) {
                Msg.info('Added item to shopping cart');
                $('#cart-link').reloadFragment();
            },
            error: function (resp) {
                Msg.error('An error occured adding the product to your shopping cart. Please check your internet connection and try again');
            }
        });
    }

    function initProductListTitleAndContent() {
        flog('initProductListTitleAndContent');

        var productsList = $('#products-list');

        onWindowStopResize(function () {
            productsList.find('.product-title').dotdotdot({
                height: 26
            });

            productsList.find('.product-content').dotdotdot({
                height: 60
            });
        });
    }

    function initProductsList() {
        flog('initProductsList');

        initProductListTitleAndContent();
        initAddToCartForProductList();
    }

    $(function () {
        initProductsList();
    });

})(jQuery)