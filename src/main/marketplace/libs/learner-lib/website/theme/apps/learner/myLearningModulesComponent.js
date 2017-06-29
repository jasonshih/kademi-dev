(function($){
    $(document).ready(function() {
        if($('.my-learning-modules').length > 0) {
            initMyLearning();
            storeCourseCookie(courseHref);
        }
    });

})(jQuery);