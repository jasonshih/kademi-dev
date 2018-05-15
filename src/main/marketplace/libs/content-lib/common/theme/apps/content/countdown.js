$(function () {
    $('.kcountdown').each(function () {
        var date = $(this).attr('data-date');
        var face = $(this).attr('data-clock-face');
        var options = {
            countdown: true
        };
        if (face){
            options.clockFace = face;
        }
        var clock = $(this).FlipClock(new Date(date),options);
    })
});