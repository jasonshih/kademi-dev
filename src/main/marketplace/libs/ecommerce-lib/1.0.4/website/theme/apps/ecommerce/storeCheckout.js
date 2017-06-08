(function (w) {
    function paymentForm() {
        var _self = this;
        _self.callbacks = [];

        _self.beforePostForm = function (callback) {
            if (typeof callback === 'function') {
                _self.callbacks.push(callback);
            }
        };
    }

    w.paymentForm = new paymentForm();
})(window);


(function(){
    window.initEcommerceCheckout = function() {
        flog('initEcommerceCheckout');
        initCartForm();
        initItemQuantity();
        initRemoveItem();
        initPaymentOptionSelect();
        initLoginForm();

        $('.btn-decrease-quantity, .btn-increase-quantity, .ecom-txt-quantity, .btn-ecom-remove-item').prop('disabled', false);
    }

    function initCartForm() {
        $('#cart-form').forms({
            validate: function (form) {
                var icon = form.find('button[type=submit] i');

                icon.show();

                var cvv = form.find('[name=cardcvn]');
                if (cvv.val() && isNaN(cvv.val())) {
                    icon.hide();
                    return {
                        error: 1,
                        errorFields: [cvv],
                        errorMessages: ['CVV must be a number']
                    };
                }

                if (cvv.val() && cvv.val().length < 3) {
                    icon.hide();
                    return {
                        error: 1,
                        errorFields: [cvv],
                        errorMessages: ['CVV must have 3 digital characters']
                    };
                }

                var phone = form.find('[name=phone]');
                var phoneValue = phone.val();
                if (phoneValue) {
                    var regex = /-|\+|\s|\(|\)|x|ext|,|\.|\//ig;
                    var phoneValue = phoneValue.replace(regex, '');
                    if (isNaN(phoneValue)) {
                        icon.hide();
                        return {
                            error: 1,
                            errorFields: [phone],
                            errorMessages: ['Please enter a valid phone number']
                        };
                    }
                }

                return true;
            },
            beforePostForm: function (form, config, data) {
                var newData = {};
                data = data.split('&');

                for (var i = 0; i < data.length; i++) {
                    var pair = data[i].split('=');
                    var key = pair[0];
                    var value = decodeURIComponent(pair[1]).replace(/\+/g, ' ');
                    newData[key] = value;
                }

                for (var i = 0; i < paymentForm.callbacks.length; i++) {
                    var cb = paymentForm.callbacks[i];
                    cb.call(form, newData);
                }


                // AN: getting the cart items fields. since bss336
                var cartData = $('#cart-items').serialize();
                cartData = cartData.split('&');
                for (var i = 0; i < cartData.length; i++) {
                    var pair = cartData[i].split('=');
                    var key = pair[0];
                    var value = decodeURIComponent(pair[1]).replace(/\+/g, ' ');
                    newData[key] = value;
                }

                return $.param(newData);
            },
            onSuccess: function (resp) {
                if (resp.status) {
                    $('#cart-form, #cart-link').reloadFragment({
                        whenComplete: function () {
                            $('#cart-form').hide('fast');
                            $('#cart-items').hide('fast');
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
                }

                $('#cart-form').find('button[type=submit] i').hide();
            }
        });
    }

    function initItemQuantity() {
        flog('initItemQuantity');

        var body = $(document.body);
        var changeQuantity = function (trigger, isIncrease) {
            var inputGroup = trigger.closest('.input-group');
            var txtQuantity = inputGroup.find('.ecom-txt-quantity');
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

        var quantityUpdateTimer = null;
        body.on('change', '.ecom-txt-quantity', function (e) {
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
        flog("doQuantityUpdate", href);

        var actors = $('.btn-decrease-quantity, .btn-increase-quantity, .ecom-txt-quantity, .btn-ecom-remove-item');
        actors.prop('disabled', true);

        $.ajax({
            type: 'POST',
            url: "/storeCheckout",
            data: {
                changeItemHrefQuantity: href,
                quantity: quantity
            },
            datatype: "json",
            success: function (data) {
                $("#ecomItemsTable, #cart-link").reloadFragment({
                    whenComplete: function (resp) {
                        Msg.info("Updated item in your shopping cart");
                        actors.prop('disabled', false);
                    }
                });
            },
            error: function (resp) {
                Msg.error("An error occured adding the product to your shopping cart. Please check your internet connection and try again");
            }
        });
    }

    function initRemoveItem() {
        flog('initRemoveItem');

        $(document.body).on('click', '.btn-ecom-remove-item', function (e) {
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
                $("#ecomItemsTable, #cart-link").reloadFragment({
                    whenComplete: function () {
                        Msg.info("Removed item from your shopping cart");
                    }
                });
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
            var op = btn.data('option');

            $('.payment-option i').removeClass('active');
            btn.find('i').addClass('active');

            var paymentForms = $('.payment-form');
            paymentForms.hide();

            var selectedForm = $('#pf-' + pid);
            selectedForm.show();

            var cartForm = $('#cart-form');
            cartForm.find('input[name=paymentProvider]').val(pid);
            cartForm.find('input[name=paymentOption]').val(op);

            checkPaymentRequiredFields();
        });
    }

    function checkPaymentRequiredFields() {
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

})(jQuery);

