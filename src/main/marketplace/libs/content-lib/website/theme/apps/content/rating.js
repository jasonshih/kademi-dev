$(function () {
    if (!$('body').hasClass('content-editor-page')) {
        $('.krating').each(function () {
            $(this).rateYo({
                halfStar: true,
                rating: $(this).attr('data-rating'),
                readOnly: true
            });
        })
    }
});