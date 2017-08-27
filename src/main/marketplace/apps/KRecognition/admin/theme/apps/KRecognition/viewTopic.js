(function ($) {
    $(function () {
        $("#topic-detail-form").forms({
            onSuccess: function (resp, form, config) {
                Msg.success("Saved");
            }
        });
    });
})(jQuery);