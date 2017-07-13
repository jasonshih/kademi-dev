(function($){
    $(document).ready(function(){
        if($('.data-series-page').length > 0) {
            $(".data-series-page .clickableRow").click(function () {
                window.document.location = $(this).attr("href");
            });
        }
    });
})(jQuery);