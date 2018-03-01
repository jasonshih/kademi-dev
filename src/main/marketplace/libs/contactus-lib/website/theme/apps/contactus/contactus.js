(function ($) {
    $(function () {
        $('.contactFormComponent').each(function () {
            var container = $(this);
            var form = container.find("form.contactus");
            var redirectUrl = form.attr('data-redirect-url');

            form.forms({
                onSuccess: function () {
                    if (redirectUrl) {
                        window.location.href = redirectUrl;
                    } else {
                        form.animate({opacity: 0}, 500, function () {
                            form.hide();
                            container.find(".thankyou").show(100);
                        });
                    }
                }
            });
        });

        var $contact = $(".contact-requests-component");
        if ($contact.length > 0) {
            $contact.find('.timeago').timeago();
        }
    });
})(jQuery);
