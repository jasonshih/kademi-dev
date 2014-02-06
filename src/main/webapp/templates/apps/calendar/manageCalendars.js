function initManageCalendars() {
	var modal = $('#modal-add-calendar');

	$('.btn-add-calendar').on('click', function (e) {
		e.preventDefault();

		modal.modal('show');
	});

	modal.find('form').forms({
        callback: function() {
            window.location.reload();
        }
    });

    jQuery.timeago.settings.allowFuture = true;
    $('abbr.timeago').timeago();
    initFullCalendar();
    initDeletes();
}

function initManageCalendar() {
    $('.AddEvent').click(function() {
        showModal($('#addEventModal'));
    });
    $('#addEventModal form').forms({
        callback: function() {
            window.location.reload();
        }
    });
    initFullCalendar();
    initDeletes();
}

function initManageEvent() {
    log('initManageEvent');
    initHtmlEditors($('.htmleditor'));
    $('.manageEventForm').forms();
}

function initDeletes() {
    $('.btn-delete').click(function(e){
        e.preventDefault();

        var btn = $(this);
        var href = btn.attr('href');
        var name = btn.closest('tr').find('th:first').text();

        confirmDelete(href, name, function() {
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
            log('eventDrop', event.end);
            adjustStartDate(event, deltaDays, minuteDelta);
//            addStartDate(event, deltaDays, minuteDelta);
//            addEndDate(event, deltaDays, minuteDelta);
//            updateEvent(event);
        },
        eventResize: function(event, deltaDays, minuteDelta) {
            log('eventResize', event.end);
            adjustEndDate(event, deltaDays, minuteDelta);
//            addStartDate(event, 0, 0);
//            addEndDate(event, deltaDays, minuteDelta);
//            updateEvent(event);
        }

    });
}

