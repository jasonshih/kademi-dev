(function ($) {
    $(function () {
        var panels = $('.panel-circle-sales');
        
        if (panels.length > 0) {
            var components = panels.closest('[data-type^=component]');
            
            components.each(function () {
                initCircleSales($(this));
            });
            
            $(document.body).on('pageDateChanged', function () {
                flog('pageDateChanged for panelKpiTarget');
                
                components.find('[data-dynamic-href]').reloadFragment({
                    whenComplete: function () {
                        components.each(function () {
                            initCircleSales($(this));
                        });
                    }
                });
            });
        }
    });
    
    function initCircleSales(target) {
        var colours = target.find('.circle-sales-colors');
        
        target.find('.circle-sales-knob').each(function () {
            var knob = $(this);
            
            var fgColor = '';
            if (knob.hasClass('circle-sales-primary')) {
                fgColor = colours.find('.btn-primary').css('background-color');
            } else if (knob.hasClass('circle-sales-info')) {
                fgColor = colours.find('.btn-info').css('background-color');
            } else if (knob.hasClass('circle-sales-success')) {
                fgColor = colours.find('.btn-success').css('background-color');
            } else if (knob.hasClass('circle-sales-warning')) {
                fgColor = colours.find('.btn-warning').css('background-color');
            } else if (knob.hasClass('circle-sales-danger')) {
                fgColor = colours.find('.btn-danger').css('background-color');
            }
            
            knob.attr({
                'data-width': '100%',
                'data-displayinput': 'false',
                'data-thickness': '.09',
                'data-bgColor': 'rgba(0, 0, 0, .2)',
                'data-fgColor': fgColor
            }).knob({
                readOnly: true
            });
        });
    }
    
})(jQuery);