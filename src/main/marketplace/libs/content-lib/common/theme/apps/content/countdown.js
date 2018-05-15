$(function () {
    $('.kcountdown').each(function () {
        var date = $(this).attr('data-date');
        var clock = $(this).FlipClock(new Date(date),{
            clockFace: 'DailyCounter',
            countdown: true
        });
    })
});