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
        var selectedLang = $.cookie("selectedLangCode");
        if (selectedLang){
            options.language = selectedLang.toLowerCase();
        }
        var clock = $(this).FlipClock(new Date(date),options);
    })
});