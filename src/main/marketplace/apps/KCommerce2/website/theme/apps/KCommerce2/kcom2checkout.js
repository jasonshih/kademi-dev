function initKcom2CheckoutForm() {
    var findEmailForm = $('#kcom2FindEmailForm');
    var kcom2PasswordForm = $('#kcom2PasswordForm');
    var kcom2ShippingForm = $('#kcom2ShippingForm');
    var kcom2ShippingProvider = $('#kcom2ShippingProvider');
    var kcom2CartForm = $('#cart-form');
    findEmailForm.forms({
        onSuccess: function (resp) {
            if (resp && resp.status){
                findEmailForm.addClass('hide');
                kcom2PasswordForm.removeClass('hide');
                kcom2PasswordForm.find('[name=kcom2Email]').val(findEmailForm.find('[name=findProfileEmail]').val());
            }
        }
    });

    findEmailForm.on('click', '.btn-skip', function () {
        findEmailForm.addClass('hide');
        kcom2ShippingForm.removeClass('hide');
    });

    kcom2PasswordForm.on('click', '.btn-prev', function () {
        findEmailForm.removeClass('hide');
        kcom2PasswordForm.addClass('hide');
    });

    kcom2PasswordForm.user({
        afterLoginUrl: 'none',
        userNameSelector: kcom2PasswordForm.find('[name=kcom2Email]'),
        passwordSelector: kcom2PasswordForm.find('[name=kcom2Password]'),
        onSuccess: function () {
            $('[data-type="component-menu"]').reloadFragment({
                whenComplete: function (resp) {
                    var html = resp.find('[data-type="component-menu"]').html();
                    $('[data-type="component-menu"]').html(html);
                    kcom2PasswordForm.addClass('hide');
                    kcom2ShippingForm.removeClass('hide');
                }
            });
        }
    });

    kcom2ShippingProvider.on('click', '.btn-prev', function () {
        kcom2PasswordForm.removeClass('hide');
        kcom2ShippingForm.addClass('hide');
    });

    kcom2ShippingForm.forms({
        allowPostForm: false,
        onValid: function () {
            kcom2ShippingForm.addClass('hide');
            kcom2ShippingProvider.removeClass('hide');
        }
    });

    kcom2ShippingProvider.on('click', '.btn-prev', function () {
        kcom2ShippingForm.removeClass('hide');
        kcom2ShippingProvider.addClass('hide');
    });

    kcom2ShippingProvider.forms({
        allowPostForm: false,
        onValid: function () {
            kcom2ShippingProvider.addClass('hide');
            kcom2CartForm.removeClass('hide');
        }
    });

    kcom2CartForm.on('click', '.btn-prev', function () {
        kcom2ShippingProvider.removeClass('hide');
        kcom2CartForm.addClass('hide');
    });
}

$(function () {
    initKcom2CheckoutForm();
});