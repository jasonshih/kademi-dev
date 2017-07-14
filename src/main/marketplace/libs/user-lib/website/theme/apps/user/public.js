(function($){
    $(document).ready(function(){
        if($('.user-public-page').length > 0) {
            $("form.sendMessage").forms({
                callback: function (resp, form) {
                    if (resp.status) {
                        Msg.success("Your message has been sent");
                    } else {
                        Msg.error("There was a problem sending the message");
                    }
                }
            });
        }
    });
})(jQuery);