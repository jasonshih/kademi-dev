function initGroupAdminPortlet() {
    log('init group admin portlet');

    $(document.body).on('change', '.modal-edit-programs input[type=radio]', function () {
        log('clicked', this);

        var radioBtn = $(this);
        var modal = radioBtn.closest('.modal');
        var groupName = modal.find('h4 span').text();
        var itemHref = radioBtn.closest('article').find('a').attr('href');

        saveGroupProgram(groupName, itemHref, radioBtn, modal);
    });

    $(document.body).on('click', '.btn-remove-module', function (e) {
        e.preventDefault();
        var btn = $(this);
        var enrolId = btn.data("id");
        var href = btn.data("href");
        var elem = btn.closest('article');
        if (confirm("Are you sure you want to remove the enrolement to " + href + "?")) {
            removeGroupProgram(enrolId, elem);
        }
    });
}

function saveGroupProgram(groupName, itemHref, radioBtn, modal) {
    var value = radioBtn.closest('form').find('input[name="' + radioBtn.attr('name') + '"]:checked').val();
    flog(value, itemHref);
    try {
        $.ajax({
            type: 'POST',
            url: itemHref,
            data: {
                group: groupName,
                enrolement: value
            },
            dataType: 'json',
            success: function (response) {
                log('saved ok', response);

                var id = modal.attr('data-program-id');

                $('#' + id).load(window.location.pathname + ' #' + id + '> *');

                modal.modal('hide');
            },
            error: function (resp) {
                log('error', resp);
                Msg.error('An error occured updating the enrolement information');
            }
        });
    } catch (e) {
        log('exception in createJob', e);
    }
}

function removeGroupProgram(enrolId, elem) {
    flog(enrolId);
    try {
        $.ajax({
            type: 'POST',
            url: window.location.pathname,
            data: {
                enrolementId: enrolId,
                removeEnrolement: true
            },
            dataType: 'json',
            success: function (response) {
                flog('saved ok', response);
                elem.remove();
            },
            error: function (resp) {
                flog('error', resp);
                Msg.error('An error occured updating the enrolement information');
            }
        });
    } catch (e) {
        flog('exception in createJob', e);
    }
}