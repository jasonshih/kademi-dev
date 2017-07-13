
(function($){
    $(document).ready(function(){

        if($('.panel-password-reset').length > 0) {

            $("#passwordResetForm").forms({
                validationFailedMessage: "Please enter a valid email address below.",
                callback: function (resp) {
                    log("done", resp);
                    $("#validationMessage").addClass("no-display");
                    $(".postsend .msg").text(resp.messages[0]);
                    $(".presend").hide(500);
                    $(".postsend").show(500);
                },
                errorHandler: function (resp) {
                    $("#validationMessage span").text(resp.messages[0]);
                    $("#validationMessage").removeClass("no-display");
                }
            });
        }
    });
})(jQuery);