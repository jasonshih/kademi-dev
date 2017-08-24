(function ($) {
    $(function () {
        var components = $('[data-type="component-panelKpiTarget"]');
        
        if (components.length > 0) {
            $(document.body).on('pageDateChanged', function () {
                flog('pageDateChanged for panelKpiTarget');
                
                components.find('[data-dynamic-href]').reloadFragment();
            });
        }
    });
    
})(jQuery);