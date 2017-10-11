(function ($, window) {
    $(function () {
        var modulesList = $('.modules-list');
        if (modulesList.length > 0) {
            adjustHeightModuleGrid();
            initScrollProgress();
            initModuleListItem();
            
            $(document).on('pjaxComplete', function () {
                flog('pjaxComplete');
                
                initScrollProgress();
                initModuleListItem();
                adjustHeightModuleGrid();
            });
            
            var timer = null;
            $(window).on('resize', function () {
                timer = setTimeout(function () {
                    adjustHeightModuleGrid();
                    initModuleListItem();
                }, 250);
            });
        }
    });
    
    window.adjustHeightModuleGrid = function () {
        $('[data-type="component-modulesList"]').each(function () {
            var gridModules = $(this).find('.module-grid');
            if (gridModules.length > 0 && gridModules.find('.module-body-transparent').length === 0) {
                gridModules.each(function () {
                    var module = $(this);
                    var thumb = module.find('.module-thumb');
                    var body = module.find('.module-body');
                    
                    thumb.css('bottom', body.innerHeight() + 'px');
                });
            }
        });
    };
    
    window.initScrollProgress = function () {
        flog('initScrollProgress');
        
        $('.module-progress').each(function (i, n) {
            var div = $(n);
            var perc = div.attr('data-target-perc');
            
            if (perc && perc > 0) {
                div.animate({
                    width: perc + '%'
                }, 500);
            }
        });
    }
    
    window.initModuleListItem = function () {
        flog('initModuleListItem');
        
        $('.modules-list').each(function () {
            var modulesList = $(this);
            var isHero = modulesList.closest('.dashboard-modules-page').length > 0;
            
            modulesList.find('.module').each(function () {
                var module = $(this);
                var description = module.find('.module-description');
                
                description.trigger('destroy');
                
                description.dotdotdot({
                    height: isHero ? 125 : 100
                });
                
                description.on('click', function () {
                    description.trigger('destroy');
                });
            });
        });
    }
    
})(jQuery, window);