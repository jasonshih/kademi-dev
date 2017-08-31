(function () {
    $(function () {
        $(document.body).on('click', '.btn-add-to-cart', function (e) {
            e.preventDefault();
            var btn = $(this);
            var href = btn.attr('href');

            flog("Add to cart clicked", href);

            getOrderForm(href, function (orderForm) {
                if (orderForm == null) {
                    addToCart(href, 1);
                } else {
                    showOrderForm(href, orderForm);
                }
            });

        });

        var timer;
        $(window).on('resize', function () {
            clearTimeout(timer);
            timer = setTimeout(function () {
                // $('.cate-title').dotdotdot({
                //     height: 44
                // });
                //
                $('.product-title').dotdotdot({
                    height: 55
                });

                $('.product-content').dotdotdot({
                    height: 60
                });
            }, 200);
        }).trigger('resize');
    });

    function showOrderForm(href, orderForm) {
        createRewardOrderFormModal("orderForm", href, "Enter fields", orderForm);
    }

    function addToCart(href, quantity) {
        $.ajax({
            type: 'POST',
            url: '/checkout',
            data: {
                addItemHref: href,
                addItemQuantity: quantity
            },
            dataType: 'json',
            success: function (data) {
                if (data.status) {
                    Msg.info('Added item to shopping cart');
                    $('#cart-link').reloadFragment();
                } else {
                    Msg.error("Sorry, we could not add the item to your cart. " + data.messages);
                }
            },
            error: function (resp) {
                Msg.error('An error occured adding the product to your shopping cart. Please check your internet connection and try again');
            }
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

    function createRewardOrderFormModal(id, href, title, formHtml) {
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
            '             <form method="post" action="/checkout" style="min-height: 50px" class="form-horizontal">' +
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

    window.createRewardOrderFormModal = createRewardOrderFormModal;
})(jQuery)