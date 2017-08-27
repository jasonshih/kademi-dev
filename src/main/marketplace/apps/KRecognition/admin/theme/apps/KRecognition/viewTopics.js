(function ($) {
    $(function () {
        $("#modal-create-topic form").forms({
            onSuccess: function (resp, form, config) {
                window.location = resp.nextHref;
            }
        });
    });
})(jQuery);

