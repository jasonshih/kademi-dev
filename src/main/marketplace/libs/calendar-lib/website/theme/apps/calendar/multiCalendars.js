(function ($, window) {
    $(function () {
        var calendars = $('.multi-calendars-component');
        
        if (calendars.length > 0) {
            calendars.each(function () {
                initMultiCalendars($(this));
            });
        }
    });
    
    window.initMultiCalendars = function (target) {
        flog('initMultiCalendars', target);
        
        var selectedCalendar = target.attr('data-calendar');
        target.find('.multi-calendars-list').each(function () {
            var list = $(this);
            var year = list.attr('data-year');
            
            list.find('.multi-calendar').each(function () {
                initMultiFullCalendar($(this), year, selectedCalendar);
            });
        });
    };
    
    function initMultiFullCalendar(target, year, selectedCalendar) {
        flog('initMultiFullCalendar', target, year, selectedCalendar);
        
        var month = target.attr('data-month');
        var eventsUrl = selectedCalendar ? '/Calendars/' + selectedCalendar : window.location.pathname;
        target.fullCalendar({
            header: {
                left: '',
                center: 'title',
                right: ''
            },
            editable: false,
            allDayDefault: false,
            themeSystem: 'bootstrap3',
            events: eventsUrl
        }).fullCalendar('gotoDate', new Date(year, (+month - 1)));
    }
    
})(jQuery, window);