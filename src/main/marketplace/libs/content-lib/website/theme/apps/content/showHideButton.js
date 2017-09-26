(function ($) {
    var COMPONENT_SELECTOR = '[data-type="component-showHideButton"]';
    
    $(function () {
        if (!$(document.body).hasClass('content-editor-page')) {
            initShowHideButton();
        }
    });
    
    function initShowHideButton() {
        var components = $(COMPONENT_SELECTOR);
        
        if (components.length > 0) {
            components.nextAll().not(COMPONENT_SELECTOR).hide();
            
            components.each(function () {
                var component = $(this);
                var hiddenSection = component.nextUntil(COMPONENT_SELECTOR);
                var btn = component.find('.btn-show-hide');
                
                btn.on('click', function (e) {
                    e.preventDefault();
                    
                    var i = btn.find('i');
                    var event;
                    if (btn.hasClass('showed-hidden-content')) {
                        hiddenSection.hide();
                        btn.removeClass('showed-hidden-content');
                        i.attr('class', 'fa ' + btn.attr('data-collapsed-icon'));
                        event = 'hidden.showHideButton';
                    } else {
                        hiddenSection.show();
                        btn.addClass('showed-hidden-content');
                        i.attr('class', 'fa ' + btn.attr('data-expanded-icon'));
                        event = 'shown.showHideButton';
                    }
                    
                    btn.trigger(event, hiddenSection);
                    btn.trigger('clicked.showHideButton', hiddenSection);
                });
            });
        }
    }
    
})(jQuery);