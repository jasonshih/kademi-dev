(function ($) {
    $(function () {
        $(document).on('click', '.kpiPeriodPicker .dropdown-menu a', function (e) {
            e.preventDefault();
            
            var a = $(this);
            var startDate = a.attr('data-start');
            var endDate = a.attr('data-end');
            var selectedPeriod = a.text();
            var kpiPeriodPicker = a.closest('.kpiPeriodPicker');
            
            $.cookie('pageDatePicker-startDate', startDate);
            $.cookie('pageDatePicker-endDate', endDate);
            $.cookie('kpiPeriodPicker-text', selectedPeriod);
            
            kpiPeriodPicker.find('button span.txt').text(selectedPeriod)
            kpiPeriodPicker.find('a.active').removeClass('active');
            a.addClass('active');
            
            $(document.body).trigger('pageDateChanged', startDate, endDate);
        });
        
        var kpiPeriodPicker = $('.kpiPeriodPicker');
        var cookiePeriod = $.cookie('kpiPeriodPicker-text');
        if (!cookiePeriod) {
            setTimeout(function () {
                kpiPeriodPicker.find('ul li a.current').trigger('click');
            }, 250);
        } else {
            kpiPeriodPicker.find('ul li a:contains("' + cookiePeriod + '")').trigger('click');
        }
    });
    
})(jQuery);
