(function($){
    $(function(){
        if($('.password-do-reset-component').length > 0) {
            $("#passwordResetForm").forms({
                onSuccess: function (resp) {
                    log("done", resp);
                    $(".presend").fhide();
                    $(".postsend").fshow();
                    window.location = "/dashboard";
                }
            });
            if ($("#token").val()) {
                $("#token, label[for=token]").hide();
            }
        }
    });

})(jQuery);