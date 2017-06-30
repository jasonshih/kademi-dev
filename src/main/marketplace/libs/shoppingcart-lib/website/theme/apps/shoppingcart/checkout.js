$(function () {
    initCheckout();
});

function initCheckout() {
    flog('initCheckout');
    initCartForm();
    initItemQuantity();
    initRemoveItem();
    initCheckoutPanels();
    initPromoCodes();
    initOrgAddress();
    $('.btn-decrease-quantity, .btn-increase-quantity, .txt-quantity, .btn-remove-item').prop('disabled', false);
}

function initPromoCodes() {
    $("body").on("click", ".apply-promo-codes", function (e) {
        e.preventDefault();
        var cont = $(e.target).closest(".promo-codes-container");
        var inp = cont.find("input[name=promoCodes]");
        var codes = inp.val();
        $.cookie('promoCodes', codes, {expires: 360, path: '/'});

        $('#itemsTable').reloadFragment({
            whenComplete: function (resp) {
                Msg.info('Applied promotion codes');
            }
        });

    });
}

function initCartForm() {
    $('#cart-form').forms({
        validate: function (form) {
            var submitBtn = form.find('button[type=submit]');
            var icon = submitBtn.find('i');
            submitBtn.prop('disabled', true);
            icon.show();

            var phone = form.find('[name=phone]');
            var phoneValue = phone.val();
            if (phoneValue) {
                var regex = /-|\+|\s|\(|\)|x|ext|,|\.|\//ig;
                var phoneValue = phoneValue.replace(regex, '');
                if (isNaN(phoneValue) || phoneValue.length < 5) {
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

            // AN: getting the cart items fields. since bss336
            var cartData = $('#cart-items').serialize();
            cartData = cartData.split('&');
            for (var i = 0; i < cartData.length; i++) {
                var pair = cartData[i].split('=');
                var key = pair[0];
                var value = decodeURIComponent(pair[1]).replace(/\+/g, ' ');
                newData[key] = value;
            }
            form.trigger("onBeforeCheckout", [newData, form]);

            return $.param(newData);
        },
        onSuccess: function (resp) {
            if (resp.status) {
                var pointsLink = $('.points-link');
                $('#cart-form, #cart-link').reloadFragment({
                    whenComplete: function (resp) {
                        $('#cart-form').hide('fast');
                        $('#cart-items').hide('fast');
                        $('#checkout-info').hide('fast');
                        $('#successfull-div').show('slow');

                        $('#cart-form').find('button[type=submit]').prop('disabled', false).find('i').hide();
                        var pointsLinkUpdate = $(resp).find('.points-link');
                        pointsLink.each(function (index) {
                            $(this).html(pointsLinkUpdate[index].innerHTML);
                        })
                    }
                });
            } else {
                Msg.warning(resp.messages[0])
            }
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
        var quantity = $.trim(txtQuantity.val());

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
            $('#itemsTable, #cart-link, #checkout-info').reloadFragment({
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

function initCheckoutPanels() {
    var panels = $("#checkout-panels");
    var form = $("#checkout-panels form");
    panels.on("click", ".wizard-btn-1", function (e) {
        e.preventDefault();
        var ok = true;
        form.find(".quantity").each(function (i, n) {
            var inp = $(n);
            if (checkNumeric(inp, form)) {
                var num = inp.val();
                var tr = inp.closest("tr");
                var cost = tr.find(".cost").text();
                var newSubtotal = num * cost;
                flog("num,cost,sub", num, cost, newSubtotal);
                tr.find(".subtotal").text(newSubtotal);
            } else {
                ok = false;
            }
        });
        if (ok) {
            $("#confirmTableBody").html($("#itemsTableBody").html());
            $("#confirmTableBody").find("input.quantity").each(function (i, n) {
                var node = $(n);
                var q = node.val();
                node.replaceWith("<span>" + q + "</span>");
                flog("q", node)
            });
            $("#confirmTableBody").find(".deleteItem, .itemHref").remove();

            var tabs = $('#checkout-tabs a[href="#tab-shipping"]');
            tabs.parent().removeClass("disabled")
            tabs.tab("show");
        } else {
            Msg.error("Please enter valid quantities");
        }
    });
    panels.on("click", ".wizard-btn-2", function (e) {
        e.preventDefault();
        var addr = $(".ship-address");
        addr.empty();
        var addr1 = $('#tab-shipping input[name="addressLine1"]').val();
        var addr2 = $('#tab-shipping input[name="addressLine2"]').val();
        var postCode = $('#tab-shipping input[name="postcode"]').val();
        var state = $('#tab-shipping input[name="state"]').val();
        addr.append(addr1)
                .append('<br/>')
                .append(addr2)
                .append('<br/>')
                .append(postCode)
                .append('<br/>')
                .append(state);
        resetValidation(form);
        var tabs = $('#checkout-tabs a[href="#tab-final"]');
        tabs.parent().removeClass("disabled")
        tabs.tab("show");
    });

    panels.on("click", ".wizard-btn-final", function (e) {
        e.preventDefault();
        form.submit();
    });
    panels.on("click", ".remove", function (e) {
        var tr = $(e.target).closest("tr");
        tr.remove();
        var href = tr.find("input.itemHref").val();
        doRemoveFromCart(href);
        Msg.info("Removed item");
    });
    panels.on("change", ".quantity", function (e) {
        flog("q change");
        var target = $(e.target);
        if (checkNumeric(target, form)) {
            var num = target.val();
            var tr = target.closest("tr");
            var cost = tr.find(".cost").text();
            var newSubtotal = num * cost;
            var href = target.next(".itemHref").val();
            flog("num,cost,sub,href", num, cost, newSubtotal, href);
            tr.find(".subtotal").text(newSubtotal);
            doQuantityUpdate(href, num);
        } else {
            Msg.error("Please enter a valid quantity");
        }
    });
    $('#myTabs').on("click", 'a', function (e) {
        if ($(this.parentNode).hasClass("disabled")) {
            e.preventDefault();
            return false;
        }
    });
}

function initOrgAddress() {
    $(document).on('change', '#selectedOrgAddress', function () {
        var selectedOrg = this.value;
        if (selectedOrg !== $.cookie('selectedOrg')){
            $.cookie('selectedOrg', selectedOrg);
            $('#cart-form').reloadFragment();
        }
    });
}