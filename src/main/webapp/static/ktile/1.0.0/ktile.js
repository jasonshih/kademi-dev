$(function () {
    var ktileWrappers = $('.ktile-wrapper');
    ktileWrappers.each(function () {
        var wrapper = $(this);
        var ktile = wrapper.find('.ktile');
        var isLgH = ktile.hasClass('ktile-lg-h');

        if (isLgH) {
            wrapper.addClass('col-lg-6 col-md-6 col-sm-6');
        } else {
            wrapper.addClass('col-lg-3 col-md-3 col-sm-3');
        }
    });
});