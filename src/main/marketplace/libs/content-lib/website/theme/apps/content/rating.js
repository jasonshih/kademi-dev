$(function() {
    if(!$('body').hasClass('content-editor-page')){
        $('.krating').each(function () {
            $(this).barrating({
                theme: 'fontawesome-stars-o',
                readonly: true,
                initialRating: $(this).attr('data-rating')
            });
        })
    }

});