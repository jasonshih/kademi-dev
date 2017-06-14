function initGroupAdminPortlet() {
    log('init group admin portlet');

    var modal = $('#modal-edit-programs');
    var groupName = modal.attr('data-group');

    modal.on('change', 'input[type=radio]', function () {
        var radioBtn = $(this);
        var itemHref = radioBtn.closest('article').find('a').attr('href');

        try {
            $.ajax({
                type: 'POST',
                url: itemHref,
                data: {
                    group: groupName,
                    enrolement: radioBtn.val()
                },
                dataType: 'json',
                success: function (response) {
                    log('saved ok', response);

                    $('#programs-list').reloadFragment({
                        whenComplete: function () {
                            modal.modal('hide');
                        }
                    });
                },
                error: function (resp) {
                    log('error', resp);
                    Msg.error('An error occured updating the enrolement information');
                }
            });
        } catch (e) {
            log('Exception in adding enrolement', e);
        }
    });

    $(document.body).on('click', '.btn-remove-module', function (e) {
        e.preventDefault();

        var btn = $(this);
        var enrolId = btn.data("id");
        var href = btn.data("href");
        var article = btn.closest('article');

        if (confirm("Are you sure you want to remove the enrolement to " + href + "?")) {
            try {
                $.ajax({
                    type: 'POST',
                    url: '/groups/',
                    data: {
                        enrolementId: enrolId,
                        removeEnrolement: true
                    },
                    dataType: 'json',
                    success: function (response) {
                        flog('saved ok', response);
                        article.remove();
                    },
                    error: function (resp) {
                        flog('error', resp);
                        Msg.error('An error occured updating the enrolement information');
                    }
                });
            } catch (e) {
                flog('Exception in deleting enrolement', e);
            }
        }
    });
}
