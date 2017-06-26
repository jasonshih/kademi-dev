$(function () {
    if ($('.productParameterSelect').length) {
        $('abbr.timeago').timeago();
        
        $('.productParameterSelect').change(function () {
            var optSelect = $(this);
            flog('productParameterSelect changed', optSelect);
            var uri = URI(window.location);
            uri.setSearch(optSelect.attr('name'), optSelect.val());
            var href = uri.toString();
            flog('New uri', href);
            history.pushState(null, null, href);
            
            $('#product-images, #product-price, #btn-add-to-cart-wrapper').reloadFragment({
                url: href
            });
        });
    }
});
