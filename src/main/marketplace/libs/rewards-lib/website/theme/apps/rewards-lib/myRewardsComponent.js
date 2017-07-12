(function($){
    $(document).ready(function(){
        if($('.my-rewards-component').length > 0) {
            $.timeago.settings.allowFuture = true;
            $("abbr.timeago").timeago();
        }
    });
})(jQuery);