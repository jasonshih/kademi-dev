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
	var modal = $('#modal-add-event');

	$('.btn-add-event').on('click', function (e) {
		e.preventDefault();

		modal.modal('show');
	});

	modal.find('form').forms({
        callback: function() {
            window.location.reload();
        }
    });

    initFullCalendar();
    initDeletes();
}

function initManageEvent() {
    log('initManageEvent');
    initHtmlEditors($('.htmleditor'), getStandardEditorHeight(), null, null, 'autogrow');
    $('.manageEventForm').forms();

	$('#allowRegistration, #emailConfirm').click(function() {
		checkConfirmation();
		console.log('a');
	});

	checkConfirmation();
}

function checkConfirmation() {
	log('checkVisibility');
	if( $('#allowRegistration').is(':checked') ) {
		$('.allowReg').show();
		
		log('checkVisibility2');
		if( $('#emailConfirm').is(':checked') ) {
			$('.emailReg').show();
		} else {
			$('.emailReg').hide();
		}
	} else {
		$('.allowReg').hide();
	}
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

