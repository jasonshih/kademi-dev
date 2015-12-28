function initCheckout() {
    flog('initCheckout');
    initCartForm();
    initItemQuantity();
    initRemoveItem();
}

function initCartForm() {
    $('#cart-form').forms({
        validate: function () {
            $('#cart-form').find('button[type=submit] i').show();
            return true;
        },
        callback: function (resp) {
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
        error: function () {
            $('#cart-form').find('button[type=submit] i').hide();
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

        txtQuantity.val(quantity).change();
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

    body.on('change', '.txt-quantity', function (e) {
        e.preventDefault();
        var inpt = $(this);
        var val = inpt.val();
        var row = inpt.closest('.item-row');
        var itemHref = row.find('.itemHref');
        var href = itemHref.val();

        doQuantityUpdate(href, val);
    });
}

function doQuantityUpdate(href, quantity) {
    flog("doQuantityUpdate", href);
    $.ajax({
        type: 'POST',
        url: "/checkout",
        data: {
            changeItemHrefQuantity: href,
            quantity: quantity
        },
        datatype: "json",
        success: function (data) {
            Msg.info("Updated item in your shopping cart");
            $("#itemsTable").reloadFragment();
        },
        error: function (resp) {
            Msg.error("An error occured adding the product to your shopping cart. Please check your internet connection and try again");
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
        url: "/checkout",
        data: {
            removeItemHref: href
        },
        datatype: "json",
        success: function (data) {
            Msg.info("Removed item from your shopping cart");
            $("#itemsTable").reloadFragment();
        },
        error: function (resp) {
            Msg.error("An error occured adding the product to your shopping cart. Please check your internet connection and try again");
        }
    });
}
