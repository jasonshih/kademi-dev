function initCheckout() {
    flog('initCheckout');
    initCartForm();
    initItemQuantity();
    initRemoveItem();

    $('.btn-decrease-quantity, .btn-increase-quantity, .txt-quantity, .btn-remove-item').prop('disabled', false);
}

function initCartForm() {
    $('#cart-form').forms({
        validate: function (form) {
            $('#cart-form').find('button[type=submit] i').show();

            return true;
        },
        onSuccess: function (resp) {
            if (resp.status) {
                $('#cart-form, #cart-link').reloadFragment({
                    whenComplete: function () {
                        $('#cart-form').hide('fast');
                        $('#successfull-div').show('slow');
                    }
                });
            } else {
                Msg.warning(resp.messages[0])
            }

            $('#cart-form').find('button[type=submit] i').hide();
        },
        onError: function (resp, form, config) {
            try {
                flog('[jquery.forms] Status indicates failure', resp);

                if (resp) {
                    if (resp.messages && resp.messages.length > 0) {
                        showErrorMessage(form, config, resp.messages);
                    } else {
                        showErrorMessage(form, config, 'Sorry, we could not process your request');
                    }

                    showFieldMessages(resp.fieldMessages, form, config);
                } else {
                    showErrorMessage(form, config, 'Sorry, we could not process your request');
                }
            } catch (e) {
                flog('[jquery.forms] Error!', e);
            } finally {
                $('#cart-form').find('button[type=submit] i').hide();
            }
        }
    });
}

function initItemQuantity() {
    flog('initItemQuantity');

    var body = $(document.body);
    var changeQuantity = function (trigger, isIncrease) {
        var inputGroup = trigger.closest('.input-group');
        var txtQuantity = inputGroup.find('.txt-quantity');
        var quantity = txtQuantity.val().trim();

        if (isNaN(quantity)) {
            quantity = 0;
        } else {
            quantity = +quantity;
        }

        if (isIncrease) {
            quantity++;
        } else {
            quantity--;
        }

        if (quantity < 1) {
            quantity = 1;
        }

        txtQuantity.val(quantity).trigger('change');
    };

    body.on('click', '.btn-decrease-quantity', function (e) {
        e.preventDefault();

        var btn = $(this);

        changeQuantity(btn, false);
    });

    body.on('click', '.btn-increase-quantity', function (e) {
        e.preventDefault();

        var btn = $(this);

        changeQuantity(btn, true);
    });


    var quantityUpdateTimer = null;
    body.on('change', '.txt-quantity', function (e) {
        e.preventDefault();

        var inpt = $(this);

        clearTimeout(quantityUpdateTimer);
        quantityUpdateTimer = setTimeout(function () {

            var val = inpt.val();
            var row = inpt.closest('.item-row');
            var itemHref = row.find('.itemHref');
            var href = itemHref.val();

            doQuantityUpdate(href, val);
        }, 500);
    });
}

function doQuantityUpdate(href, quantity) {
    flog('doQuantityUpdate', href);

    var actors = $('.btn-decrease-quantity, .btn-increase-quantity, .txt-quantity, .btn-remove-item');
    actors.prop('disabled', true);

    $.ajax({
        type: 'POST',
        url: '/checkout',
        data: {
            changeItemHrefQuantity: href,
            quantity: quantity
        },
        datatype: 'json',
        success: function (data) {
            $('#itemsTable, #cart-link').reloadFragment({
                whenComplete: function (resp) {
                    Msg.info('Updated item in your shopping cart');
                    actors.prop('disabled', false);
                }
            });
        },
        error: function (resp) {
            Msg.error('An error occured adding the product to your shopping cart. Please check your internet connection and try again');
        }
    });
}

function initRemoveItem() {
    flog('initRemoveItem');

    $(document.body).on('click', '.btn-remove-item', function (e) {
        e.preventDefault();

        var btn = $(this);
        var row = btn.closest('.item-row');
        var itemHref = row.find('.itemHref');
        var href = itemHref.val();

        doRemoveFromCart(href);
    });
}

function doRemoveFromCart(href) {
    flog('doRemoveFromCart', href);
    $.ajax({
        type: 'POST',
        url: '/checkout',
        data: {
            removeItemHref: href
        },
        datatype: 'json',
        success: function (data) {
            $('#itemsTable, #cart-link').reloadFragment({
                whenComplete: function () {
                    Msg.info('Removed item from your shopping cart');
                }
            });
        },
        error: function (resp) {
            Msg.error('An error occurred removing the product to your shopping cart. Please check your internet connection and try again');
        }
    });
}
