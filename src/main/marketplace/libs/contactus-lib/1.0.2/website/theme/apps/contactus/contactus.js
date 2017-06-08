$(function () {
    $('.contactFormComponent').each(function () {
        var container = $(this);
        var form = container.find("form.contactus");
        form.forms({
            onSuccess: function() {
                form.animate({opacity: 0}, 500, function() {
                    form.hide();
                    container.find(".thankyou").show(100);
                });
            }
        });
    })
})
