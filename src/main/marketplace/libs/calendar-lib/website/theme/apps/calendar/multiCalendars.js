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
        
        // Init calendar for current year
        target.find('#multi-calendars-current-year .multi-calendars-list').each(function () {
            var list = $(this);
            var year = list.attr('data-year');
            
            list.find('.multi-calendar').each(function () {
                initMultiFullCalendar($(this), year, selectedCalendar);
            });
        });
        
        target.find('[href="#multi-calendars-next-year"]').on('shown.bs.tab', function () {
            var nextYear = target.find('#multi-calendars-next-year');
            if (!nextYear.hasClass('initialized')) {
                nextYear.addClass('initialized');
                nextYear.find('.multi-calendars-list').each(function () {
                    var list = $(this);
                    var year = list.attr('data-year');
                    
                    list.find('.multi-calendar').each(function () {
                        initMultiFullCalendar($(this), year, selectedCalendar);
                    });
                });
            }
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
            events: eventsUrl,
            height: 'auto',
            showNonCurrentDates: false,
            eventAfterAllRender: function () {
                target.find('.fc-row').each(function () {
                    var row = $(this);
                    
                    if (row.find('.fc-day.fc-disabled-day').length === 7) {
                        row.remove();
                    }
                });
            }
        }).fullCalendar('gotoDate', new Date(year, (+month - 1)));
    }
    
})(jQuery, window);