(function () {
    function initEcomProductDetails() {
        initAddToCart();
        initViewedCookie();
        initImagesCarousel();
        initItemQuantity();
    }

    function initItemQuantity() {
        flog('initItemQuantity');

        var body = $(document.body);
        var changeQuantity = function (trigger, isIncrease, doNothing) {
            var inputGroup = trigger.closest('.input-group');
            var txtQuantity = inputGroup.find('.txt-quantity');
            var quantity = txtQuantity.val().trim();

            if (isNaN(quantity)) {
                quantity = 1;
            } else {
                quantity = +quantity;
            }

            if (!doNothing) {
                if (isIncrease) {
                    quantity++;
                } else {
                    quantity--;
                }
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

        body.on('blur', '.txt-quantity', function (e) {
            e.preventDefault();

            changeQuantity($(this), null, true);
        });
    }

    function initImagesCarousel() {
        flog('initImagesCarousel');

        if ($('#product-no-image').length === 0) {
            var imageZoom = $('#product-image-zoom');

            $('#product-images').slick({
                infinite: false,
                slidesToShow: 4,
                slidesToScroll: 4,
                prevArrow: '<a href="javascript:void(0);" class="slick-prev"><i class="fa fa-angle-left"></i></a>',
                nextArrow: '<a href="javascript:void(0);" class="slick-next"><i class="fa fa-angle-right"></i></a>'
            }).find('.slick-slide').on('click', function (e) {
                e.preventDefault();

                var imgHref = $(this).find('a').attr('href');

                imageZoom.removeClass('zoomed-in');
                imageZoom.find('.product-image').css('background-image', 'url(' + imgHref + ')');
                imageZoom.trigger('zoom.destroy').zoom({
                    on: 'click',
                    url: imgHref,
                    onZoomIn: function () {
                        imageZoom.addClass('zoomed-in');
                    },
                    onZoomOut: function () {
                        imageZoom.removeClass('zoomed-in');
                    }
                });
            }).filter('.slick-current').trigger('click');
        } else {
            flog('No product image!');
        }
    }

    function initViewedCookie() {
        flog('initViewedCookie');

        var productId = window.location.pathname.split('/')[3];
        var viewed = $.cookie('viewed-products') || '';
        viewed = viewed === '' ? [] : viewed.split(',');
        flog('Viewed products:', viewed);

        if (viewed.indexOf(productId) === -1) {
            if (viewed.length >= 2) {
                flog('Viewed products\'s length is 2. Will keep only first item!');
                viewed = viewed.splice(0, 1);
            }
            viewed.unshift(productId);
        }

        flog('New viewed products:', viewed);

        $.cookie('viewed-products', viewed.join(','), {
            path: '/',
            expires: 999
        });
    }

    function initAddToCart() {
        $('.product-item .btn-ecom-add-to-cart').click(function (e) {
            e.preventDefault();
            var target = $(e.target);
            var href = target.closest('a').attr('href');
            // var quantity = +$('.txt-quantity').val().trim();
            var quantity = 1;

            flog('add item', href);
            getOrderForm(href, function (orderForm) {
                if (!orderForm) {
                    doAddToCart(href, quantity);
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

    $(document).ready(function () {
        if ($('.ecom-product-component').length > 0) {
            initEcomProductDetails();
        }
    });

})(jQuery);