(function ($) {
    $(function () {
        var myLearningModules = $('.my-learning-modules');
        if (myLearningModules.length > 0) {
            initMyLearning();
            storeCourseCookie(myLearningModules.attr('data-course-href'));
        }
    });
    
})(jQuery);