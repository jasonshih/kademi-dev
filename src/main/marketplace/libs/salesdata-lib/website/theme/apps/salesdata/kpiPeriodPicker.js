/**
 * Created by Anh on 08/03/2017.
 */
$(function () {
    $(document).on('click', '.kpiPeriodPicker .dropdown-menu a', function (e) {
        e.preventDefault();
        var startDate = $(this).attr('data-start');
        var endDate = $(this).attr('data-end');
        $.cookie('pageDatePicker-startDate', startDate);
        $.cookie('pageDatePicker-endDate', endDate);
        $.cookie('kpiPeriodPicker-text', $(this).text());
        $(this).parents('.kpiPeriodPicker').find('button span.txt').text($(this).text())
        $(this).parent().addClass('active').siblings('li').removeClass('active');
        $(document.body).trigger('pageDateChanged');
    });

    var kpiPeriodPicker = $('.kpiPeriodPicker');
    if (!$.cookie('kpiPeriodPicker-text')){
        kpiPeriodPicker.find('ul li a.current').trigger('click');
    } else {
        kpiPeriodPicker.find('ul li a:contains("'+$.cookie('kpiPeriodPicker-text')+'")').trigger('click');
    }
});