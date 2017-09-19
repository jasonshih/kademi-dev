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

            getEcomOrderForm(href, function (orderForm) {
                if (!orderForm) {
                    doAddToCart(href);
                } else {
                    showEcomOrderForm(href, orderForm);
                }
            });
        });
    }

    function getEcomOrderForm(href, callback) {
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

    function showEcomOrderForm(href, orderForm) {
        createEcomOrderFormModal("orderForm", href, "Enter fields", orderForm);
    }

    function createEcomOrderFormModal(id, href, title, formHtml) {
        flog('myPrompt');
        var existing = $('#' + id);
        if (existing) {
            existing.remove();
        }

        var modalString = '<div class="modal" tabindex="-1" role="dialog">' +
            '    <div class="modal-dialog" role="document">' +
            '        <div class="modal-content">' +
            '            <div class="modal-header">' +
            '                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
            '                <h4 class="modal-title">' + title + '</h4>' +
            '            </div>' +
            '            <div class="modal-body">' +
            '             <form method="post" action="/storeCheckout" style="min-height: 50px" class="form-horizontal">' +
            '                 <input type="hidden" name="addItemHref" value="" />' +
            '                 <input type="hidden" name="addItemQuantity" value="1" />' +
            '                 <div class="order-form-body">' + formHtml + '</div>' +
            '             </form>' +
            '            </div>' +
            '            <div class="modal-footer">' +
            '                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' +
            '                <button type="button" class="btn btn-primary btn-submit">OK</button>' +
            '            </div>' +
            '        </div><!-- /.modal-content -->' +
            '    </div><!-- /.modal-dialog -->' +
            '</div>';


        var myPromptModal = $(modalString);
        $('body').append(myPromptModal);
        myPromptModal.find("input[name=addItemHref]").val(href);

        var form = myPromptModal.find('form');
        form.forms({
            onSuccess: function () {
                flog("success, close modal");
                Msg.info('Added item to shopping cart');
                $('#cart-link').reloadFragment();
                myPromptModal.modal("hide");
            }
        });

        myPromptModal.find(".btn-submit").click(function () {
            flog("clicked");
            form.submit();
        });

        flog("show", myPromptModal);
        myPromptModal.modal("show");
        //showModal(myPromptModal);
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

    window.createEcomOrderFormModal = createEcomOrderFormModal;
    window.showEcomOrderForm = showEcomOrderForm;
    window.getEcomOrderForm = getEcomOrderForm;
})(jQuery)