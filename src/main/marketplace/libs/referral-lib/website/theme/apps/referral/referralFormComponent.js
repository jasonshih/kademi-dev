(function($){
    $(document).ready(function(){
        if($('.referral-form-component').length > 0) {
            $("form.referral").forms({
                callback: function() {
                    debugger;
                    $("form.referral").animate({opacity: 0}, 500, function() {
                        $("form.referral").hide();
                        $(".thankyou").show(100);
                    });
                }
            });
        }
    });
})(jQuery);