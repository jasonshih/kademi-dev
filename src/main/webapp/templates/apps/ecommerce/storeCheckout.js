function initEcommerceCheckout() {
    flog('initEcommerceCheckout');
    initItemQuantity();
    initRemoveItem();
    initPaymentOptionSelect();
    initLoginForm();
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
        url: "/storeCheckout",
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
        url: "/storeCheckout",
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

function initPaymentOptionSelect() {
    flog('initPaymentOptionSelect');

    // First check to see if the current form has any required fields
    checkPaymentRequiredFields();

    // Next we setup event handlers
    $('body').on('click', '.payment-option', function (e) {
        e.preventDefault();

        var btn = $(this);
        var pid = btn.data('pid');

        var paymentForms = $('.payment-form');
        paymentForms.hide();

        var selectedForm = $('#pf-' + pid);
        selectedForm.show();

        checkPaymentRequiredFields();
    });
}

function checkPaymentRequiredFields() {
    flog('checkPaymentRequiredFields');
    var paymentForms = $('.payment-form');
    paymentForms.each(function (i, item) {
        var f = $(item);
        var isShown = f.is(':visible');
        var requiredField = f.find('.required-if-shown');
        if (isShown) {
            f.find('input, select, textarea, button').disable(false);
            requiredField.addClass('required');
            requiredField.attr('required', 'required');
        } else {
            f.find('input, select, textarea, button').disable(true);
            requiredField.removeClass('required');
            requiredField.removeAttr('required');
        }
    });
}

function initLoginForm() {
    jQuery(".login-form").user({
        afterLoginUrl: window.location.pathname,
        valiationMessageSelector: "p.login.message"
    }); // setup login and logout
}