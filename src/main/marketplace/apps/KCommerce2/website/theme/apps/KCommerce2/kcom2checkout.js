function initKcom2CheckoutForm() {
    var findEmailForm = $('#kcom2FindEmailForm');
    var kcom2PasswordForm = $('#kcom2PasswordForm');
    var kcom2RegoForm = $('#kcom2RegoForm');
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
        },
        onError: function () {
            // Show rego form with skip button
            kcom2RegoForm.removeClass('hide');
            findEmailForm.addClass('hide');
            kcom2RegoForm.find('[name=kcom2Email]').val(findEmailForm.find('[name=findProfileEmail]').val());
        }
    });

    kcom2RegoForm.on('click', '.btn-skip-rego', function () {
        kcom2RegoForm.addClass('hide');
        kcom2ShippingForm.removeClass('hide');
        initCountryList();
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

    kcom2RegoForm.find('form').forms({
        onSuccess: function (resp) {
            if (resp && resp.status){
                kcom2RegoForm.addClass('hide');
                kcom2ShippingForm.removeClass('hide');
            }
        }
    });

    kcom2ShippingProvider.on('click', '.btn-prev', function () {
        kcom2PasswordForm.removeClass('hide');
        kcom2ShippingForm.addClass('hide');
    });

    kcom2ShippingForm.forms({
        onSuccess: function () {
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

function initCountryList() {
    var countriesBH = new Bloodhound({
        datumTokenizer: function(d) { return Bloodhound.tokenizers.whitespace(d.name); },
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        local: getCountries()
    });

    countriesBH.initialize();

    var kcom2ShippingForm = $('#kcom2ShippingForm');
    kcom2ShippingForm.find('.country-typeahead').typeahead(null, {
        displayKey: 'name',
        valueKey: "iso_code",
        source: countriesBH.ttAdapter()
    });

    kcom2ShippingForm.find('.country-typeahead').on("typeahead:selected", function(e, datum) {
        kcom2ShippingForm.find('[name=country]').val(datum.iso_code);
    });
}

$(function () {
    initKcom2CheckoutForm();
    initCountryList();
});