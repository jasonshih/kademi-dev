$(function () {
    if ($('[data-type=component-rewardProductCartButton]').length) {
        $('abbr.timeago').timeago();

        $('.productParameterSelect').change(function () {
            var optSelect = $(this);
            flog('productParameterSelect changed', optSelect);
            var uri = URI(window.location);
            uri.setSearch(optSelect.attr('name'), optSelect.val());
            flog('New uri', uri.toString());
            history.pushState(null, null, uri.toString());

            $('#product-images, #product-price, #btn-add-to-cart-wrapper').reloadFragment({
                url: uri.toString()
            });
        });
    }
});
