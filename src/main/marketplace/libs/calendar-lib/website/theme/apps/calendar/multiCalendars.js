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
        
        var selectedCalendars = target.attr('data-calendars');
        var selectedColors = target.attr('data-colors');

        // Init calendar for current year
        target.find('#multi-calendars-current-year .multi-calendars-list').each(function () {
            var list = $(this);
            var year = list.attr('data-year');
            
            list.find('.multi-calendar').each(function () {
                initMultiFullCalendar($(this), year, selectedCalendars, selectedColors);
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
                        initMultiFullCalendar($(this), year, selectedCalendars, selectedColors);
                    });
                });
            }
        });
    };
    
    function initMultiFullCalendar(target, year, selectedCalendars, selectedColors) {
        flog('initMultiFullCalendar', target, year, selectedCalendars, selectedColors);
        var eventSources = [];
        if (selectedCalendars){
            var calendarsArr = selectedCalendars.split(',');
            var colorsArr = selectedColors.split(',');
            for (var i = 0; i < calendarsArr.length; i++){
                var eventsUrl = '/Calendars/' + calendarsArr[i];
                eventSources.push({
                    url: eventsUrl, // use the `url` property
                    color: colorsArr[i]   // an option!
                });
            }
        }

        var month = target.attr('data-month');

        target.fullCalendar({
            header: {
                left: '',
                center: 'title',
                right: ''
            },
            editable: false,
            allDayDefault: false,
            themeSystem: 'bootstrap3',
            eventSources: eventSources,
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