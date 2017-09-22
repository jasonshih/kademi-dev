var iframeUrl;
var win = $(window);

function initManageEvent() {
    flog('initManageEvent');
    useHash = true;

    var form = initEventForm();
    initConfirmationTab();
    initReminder(form);
    initReminderModal(form);
    initCreateEmail();
    initDetailsTab();
    initChosen();
    
    initFullscreenEditor($('[name=description]'), '?goto=');
}

window.onbeforeunload = function () {
    if ($('.manageEventForm').hasClass('dirty')) {
        return 'Do you want to save your changes?';
    }
};

function initChosen() {
    flog('initChosen');

    $(".chosen-select").chosen({
        search_contains: true
    });
}

function initDetailsTab() {
    flog('initDetailsTab');

    var eventRange = $('#event-range');
    eventRange.exist(function () {
        flog('init report range');
        eventRange.daterangepicker({
                format: 'DD/MM/YYYY HH:mm',
                timePicker: true,
                timePickerIncrement: 15,
                timePicker12Hour: false,
                locale: {
                    format: 'DD/MM/YYYY HH:mm'
                }
            },
            function (start, end) {
                flog('onChange', start, end);
                $('#startDate').val(formatDateTime(start));
                $('#endDate').val(formatDateTime(end));
            }
        );
    });
}

function initCreateEmail() {
    flog('initCreateEmail');

    $('.create-email').click(function (e) {
        e.preventDefault();
        showSendEmail();
    });
    $('body').on('click', '.create-email-select-website', function (e) {
        flog('click select website');
        e.preventDefault();
        var websiteName = $(e.target).attr('href');
        postCreateEmail(websiteName);
        $('#sendEmailModal').find('ul').html('<li>Please wait...</li>');
    });
}

function initConfirmationTab() {
    flog('initConfirmationTab');

    $('#allowRegistration, #emailConfirm, #allowGuests').click(function () {
        checkConfirmation();
    });

    checkConfirmation();
}

function initEventForm() {
    flog('initEventForm');

    var form = $('.manageEventForm');
    form.on('change switchChange', function (e) {
        flog('change', e);
        form.addClass('dirty');
    });

    form.forms({
        onValid: function (form) {
            // Renumber reminder inputs
            form.find('.reminders tr').each(function (i, n) {
                var tr = $(n);
                tr.find('input.enabled').attr('name', 'reminder.' + i + '.enabled');
                tr.find('input.timerMultiple').attr('name', 'reminder.' + i + '.timerMultiple');
                tr.find('input.timerUnit').attr('name', 'reminder.' + i + '.timerUnit');
                tr.find('input.subject').attr('name', 'reminder.' + i + '.subject');
                tr.find('input.themeSite').attr('name', 'reminder.' + i + '.themeSite');
                tr.find('textarea.html').attr('name', 'reminder.' + i + '.html');
            });
        },
        onSuccess: function () {
            $('.fullscreen-editor-preview').attr('src', '?goto=');
            Msg.info('Saved!');
            form.removeClass('dirty');
        }
    });

    return form;
}

function initReminder(form) {
    flog('initReminder', form);

    var reminderModal = $('#reminderDetails');
    var reminderForm = reminderModal.find('form');
    var tbody = $('tbody.reminders');

    tbody.on('click', 'a.edit', function (e) {
        e.preventDefault();
        form.addClass('dirty');
        var tr = $(e.target).closest('tr');
        var ordinal = tbody.children().index(tr);
        flog('editing row', tr, 'of', tbody, 'ordinal=', ordinal);
        reminderForm.find('input[name=reminderId]').val(ordinal + '');

        reminderForm.find('input[name=timerMultiple]').val(tr.find('.timerMultiple').val());
        reminderForm.find('.timer-unit').text(tr.find('.timerUnit').val());
        reminderForm.find('input[name=subject]').val(tr.find('.subject').val());
        reminderForm.find('select[name=themeSite]').val(tr.find('.themeSite').val());
        var html = tr.find('.html').text();
        reminderForm.find('.reminder-content').text(html);
        //reminderForm.find('.reminder-content').html(html);

        reminderModal.modal('show');
    });

    tbody.on('click', 'a.delete', function (e) {
        e.preventDefault();
        form.addClass('dirty');
        var tr = $(e.target).closest('tr');
        tr.remove();
    });

    // Reset the form when add reminder is clicked
    $('.add-reminder').click(function (e) {
        form.addClass('dirty');
        reminderForm.find('input,select').val('');
        reminderForm.find('.reminder-content').html('');
    });
}


// This is when the user saves the reminder modal
function initReminderModal(form) {
    flog('initReminderModal');

    var reminderModal = $('#reminderDetails');
    var reminderForm = reminderModal.find('form');
    var tbody = $('tbody.reminders');

    reminderForm.submit(function (e) {
        e.preventDefault();

        form.addClass('dirty');

        var timerMultiple = reminderForm.find('input[name=timerMultiple]').val();
        var timerUnit = reminderForm.find('.timer-unit').text();
        var subject = reminderForm.find('input[name=subject]').val();
        var themeSite = reminderForm.find('select[name=themeSite]').val();
        var themeSiteName = reminderForm.find('select[name=themeSite] option:selected').text();
        //var html = reminderForm.find('.reminder-content').html();
        var html = reminderForm.find('.reminder-content').val();

        if (timerUnit === '') {
            Msg.error('Please select the time units, like how many days, hours, etc');
            return;
        }

        if (timerMultiple === '') {
            Msg.error('Please select the number of ' + timerUnit);
            return;
        }

        if (subject === '') {
            Msg.error('Please enter a subject for the reminder email');
            return;
        }

        if (html.length < 5) {
            Msg.error('Please check your email message, it looks a bit short');
            return;
        }

        var ordinal = reminderForm.find('input[name=reminderId]').val();
        var tr;
        if (ordinal === '') {
            tr = $('#reminder-row-template tr').clone();
            tr.find('input[type=checkbox]').val('true').bootstrapSwitch();
            tbody.append(tr);
        } else {
            tr = tbody.children().eq(ordinal);
        }
        var b = reminderForm.find('input[name=enabled]').prop('checked');
        var status = tr.find('.reminder-status');
        status.removeClass('fa-play').removeClass('fa-exclamation-circle');
        if (b) {
            status.addClass('fa-play');
        } else {
            status.addClass('fa-exclamation-circle');
        }

        tr.find('.timerMultiple').val(timerMultiple).not('input').text(timerMultiple);
        tr.find('.timerUnit').val(timerUnit).text(timerUnit);
        tr.find('.subject').val(subject).text(subject);
        tr.find('.themeSite').val(themeSite).text(themeSiteName);
        tr.find('.html').text(html);

        reminderModal.modal('hide');
    });

    $('.timer-units li').click(function (e) {
        e.preventDefault();
        var unit = $(e.target).text();
        $('.timer-unit').text(unit);
    });
}

function checkConfirmation() {
    flog('checkConfirmation');
    if ($('#allowRegistration').is(':checked')) {
        // Show everythign, hide anything not applicable
        $('.allowReg, .allowGuests, .emailReg').show();

        if ($('#allowGuests').is(':checked')) {

        } else {
            $('.allowGuests').hide();
        }

        if ($('#emailConfirm').is(':checked')) {

        } else {
            $('.emailReg').hide();
        }
    } else {
        $('.allowReg').hide();
    }
}

function showSendEmail() {
    var modal = $('#sendEmailModal');
    modal.find('ul').html('<li>Please wait...</li>');
    modal.modal();
    $.ajax({
        type: 'GET',
        url: window.location.pathname + '?availWebsites',
        dataType: 'json',
        success: function (response) {
            log('showSendEmail: got websites', response.data);
            var newList = '';

            if (response.data.length === 1) {
                var websiteName = response.data[0];
                postCreateEmail(websiteName);
                newList += '<li>Please wait... creating group email for website ' + websiteName + '</li>';
            } else if (response.data.length > 0) {
                $.each(response.data, function (i, n) {
                    newList += '<li><a class="create-email-select-website" href="' + n + '">' + n + '</a></li>';
                });
            } else {
                newList += '<li>No websites have the Calendar app active. Please go to manage websites and enable the Calendar app for the appropriate website.</li>';
            }
            modal.find('ul').empty().html(newList);
        },
        error: function (resp) {
            Msg.error('An error occured loading websites. Please try again');
        }
    });
}

function postCreateEmail(websiteName) {
    flog('postCreateEmail', websiteName);
    $.ajax({
        type: 'POST',
        url: window.location.pathname,
        dataType: 'json',
        data: {
            createEmail: true,
            website: websiteName
        },
        success: function (data) {
            log('Created email..', data);
            if (data.status) {
                flog('redirect to', data.nextHref);
                window.location = data.nextHref;
            } else {
                Msg.error('Failed to create the group email ' + data.mssages);
            }
        },
        error: function (resp) {
            log('error', resp);
            Msg.error('Could not create the group email. Please check your internet connection, and that you have permissions');
        }

    });
}
