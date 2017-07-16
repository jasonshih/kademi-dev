(function($){
    $(document).ready(function(){
        if($('.password-do-reset-component').length > 0) {
            $("#passwordResetForm").forms({
                onSuccess: function (resp) {
                    log("done", resp);
                    $(".presend").fhide();
                    $(".postsend").fshow();
                    window.location = "/profile/";
                }
            });
            if ($("#token").val()) {
                $("#token, label[for=token]").hide();
            }
        }
    });
})(jQuery);