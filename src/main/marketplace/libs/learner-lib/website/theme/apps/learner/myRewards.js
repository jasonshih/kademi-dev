(function($){
    $(document).ready(function(){

        if($('.my-reward-page').length > 0) {
            $.timeago.settings.allowFuture = true;
            $("abbr.timeago").timeago();
        }
    });
})(jQuery);