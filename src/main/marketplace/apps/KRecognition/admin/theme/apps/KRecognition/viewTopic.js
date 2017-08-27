(function ($) {
    $(function () {
        $("#topic-detail-form").forms({
            onSuccess: function (resp, form, config) {
                Msg.onSuccess("Saved");
            }
        });
    });
})(jQuery);