$(function () {
    var ktileWrappers = $('.ktile-wrapper');
    ktileWrappers.each(function () {
        var wrapper = $(this);
        var ktile = wrapper.find('.ktile');
        var isLg = ktile.is('[class*=ktile-lg]');
        var isMd = ktile.is('[class*=ktile-md]');
        var isLgH = ktile.hasClass('ktile-lg-h');

        if (isLgH) {
            wrapper.addClass('col-xl-4 col-lg-6 col-md-6 col-sm-6');
        } else {
            if (isLg || isMd) {
                wrapper.addClass('col-xl-2 col-lg-4 col-md-4 col-sm-6');
            }
        }
    });
});