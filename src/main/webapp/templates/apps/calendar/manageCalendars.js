function initManageCalendars() {
    var modalAdd = $('#modal-add-calendar');
    var formAdd = modalAdd.find('form');
    var wrapper = $('#calendar-wrapper');

    $('.btn-add-calendar').on('click', function (e) {
        e.preventDefault();
        formAdd.attr('action', window.location.pathname);
        modalAdd.modal('show');
    });

    wrapper.on('click', 'a.calendar-edit', function (e) {
        e.preventDefault();

        var calendarCont = $(e.target).closest('.calendar-container');
        var editModal = calendarCont.find('.modal');
        editModal.modal('show');
    });

    formAdd.forms({
        callback: function () {
            modalAdd.modal('hide');
            Msg.success(formAdd.find('input[name=name]').val() + ' is created!');
            formAdd.trigger('reset');
            wrapper.reloadFragment({
                whenComplete: function () {
                    initEditModal();
                }
            });
        }
    });

    initEditModal();
    jQuery.timeago.settings.allowFuture = true;
    $('abbr.timeago').timeago();
    initFullCalendar();
    initDeletes();
}

function initEditModal() {
    var wrapper = $('#calendar-wrapper');

    $('.modal-edit-calendar').each(function () {
        var modalEdit = $(this);
        var formEdit = modalEdit.find('form');

        formEdit.forms({
            callback: function () {
                modalEdit.modal('hide');
                Msg.info('Updated calendar');
                wrapper.reloadFragment({
                    whenComplete: function () {
                        initEditModal();
                    }
                });
            }
        });
    });
}

function initManageCalendar() {
    $('.btn-add-event').on('click', function (e) {
        e.preventDefault();
        $('#modal-add-event').modal('show');
    });

    var modal = $('#modal-add-event');
    var form = modal.find('form');

    form.forms({
        callback: function () {
            modal.modal('hide');
            form.trigger('reset');
            Msg.success('Event is created!');
            $('#event-wrapper').reloadFragment();
            initFullCalendar();
        }
    });

    initFullCalendar();
    initDeletes();
}

function initDeletes() {
    $(document.body).on('click', '.btn-delete', function (e) {
        e.preventDefault();

        var btn = $(this);
        var href = btn.attr('href');
        var name = href;

        confirmDelete(href, name, function () {
            Msg.success(name + ' is deleted!');
            $('#calendar-wrapper').reloadFragment();
            $('#event-wrapper').reloadFragment();
            initFullCalendar();
        });
    });
}

function initFullCalendar() {
    flog('initFullCalendar');

    var calendar = $('#calendar');

    try {
        calendar.fullCalendar('destroy');
    } catch (e) {
    }

    calendar.fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        editable: true,
        allDayDefault: false,
        events: window.location.pathname,
        eventDrop: function (event, deltaDays, minuteDelta) {
            flog('eventDrop', event.end);
            adjustStartDate(event, deltaDays, minuteDelta);
        },
        eventResize: function (event, deltaDays, minuteDelta) {
            flog('eventResize', event.end);
            adjustEndDate(event, deltaDays, minuteDelta);
        }
    });
}
