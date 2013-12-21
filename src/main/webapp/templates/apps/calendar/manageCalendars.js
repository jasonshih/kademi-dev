
var selectedForum;

function initManageCalendars() {
    $(".AddCalendar").click(function() {
        showModal($("#addCalendarModal"));
    });
    $("#addCalendarModal form").forms({
        callback: function() {
            window.location.reload();
        }
    });
    jQuery.timeago.settings.allowFuture = true;
    $("abbr.timeago").timeago();

    initFullCalendar();
    initDeletes();
}

function initManageCalendar() {
    $(".AddEvent").click(function() {
        showModal($("#addEventModal"));
    });
    $("#addEventModal form").forms({
        callback: function() {
            window.location.reload();
        }
    });
    initFullCalendar();
    initDeletes();
}

function initManageEvent() {
    log("initManageEvent");
    initHtmlEditors($(".htmleditor"));
    $(".manageEventForm").forms();
}

function initDeletes() {
    $(".Delete").click(function(e){
        e.preventDefault();
        var target = $(e.target);
        var link = target.closest("a");
        var href = link.attr("href");
        var name = getFileName(href);
        confirmDelete( href, name, function() {
            window.location.reload();
        } );
    });
}

function initFullCalendar() {
    $('.calendar-container').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        editable: true,
        allDayDefault: false,
        events: window.location.pathname,
        eventDrop: function(event, deltaDays, minuteDelta) {
            log("eventDrop", event.end);
            adjustStartDate(event, deltaDays, minuteDelta);
//            addStartDate(event, deltaDays, minuteDelta);
//            addEndDate(event, deltaDays, minuteDelta);
//            updateEvent(event);
        },
        eventResize: function(event, deltaDays, minuteDelta) {
            log("eventResize", event.end);
            adjustEndDate(event, deltaDays, minuteDelta);
//            addStartDate(event, 0, 0);
//            addEndDate(event, deltaDays, minuteDelta);
//            updateEvent(event);
        }

    });
}

