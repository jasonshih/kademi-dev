(function ($) {
    $(function () {
        var components = $('[data-type="component-salesTable"]');
        
        if (components.length > 0) {
            $(document.body).on('pageDateChanged', function () {
                flog('pageDateChanged for salesTable');
                
                components.find('[data-dynamic-href]').reloadFragment();
            });
        }
    });
    
})(jQuery);