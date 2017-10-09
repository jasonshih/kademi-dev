(function ($, window) {
    $(function () {
        var myLearningModules = $('.my-learning-modules');
        if (myLearningModules.length > 0) {
            initMyLearning();
            storeCourseCookie(myLearningModules.attr('data-course-href'));
        }
        
        var modulesList = $('[data-type="component-modulesList"]');
        if (modulesList.length > 0 && modulesList.find('.module-grid').length > 0) {
            adjustHeightModuleGrid();
            
            var timer = null;
            $(window).on('resize', function () {
                timer = setTimeout(function () {
                    adjustHeightModuleGrid();
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
    
})(jQuery, window);