$(function () {
    var htmleditor = $('.htmleditor');
    var ktoolbar = $('#ktoolbar');
    var btnEditInline = ktoolbar.find('.btn-inline-edit');
    var btnSave = ktoolbar.find('.btn-inline-edit-save');
    var btnDone = ktoolbar.find('.btn-inline-edit-done');
    var body = $(document.body);

    if (htmleditor.length) {
        btnEditInline.removeClass('hide');
    }

    var ktoolbarToggle = ktoolbar.find('.ktoolbarToggle');

    ktoolbarToggle.on('click', function (e) {
        e.preventDefault();

        ktoolbar.toggleClass('show');
    });

    btnSave.on('click', function (e) {
        e.preventDefault();

        $.ajax({
            url: window.location.pathname,
            type: 'post',
            dataType: 'json',
            data: {
                body: htmleditor.keditor('getContent')
            },
            success: function (resp) {
                if (resp && resp.status) {
                    flog('inline editing saved', resp);
                    body.removeClass('content-changed');
                    Msg.success('Saved');
                    if (btnSave.hasClass('keditor-needs-destroy')) {
                        btnSave.removeClass('keditor-needs-destroy');
                        btnDone.trigger('ktoolbar.done');
                    }
                } else {
                    flog('inline editing error saving', resp);
                    Msg.error('Could not save your changes. Please try again');
                }
            },
            error: function (err) {
                flog('inline editing error saving', err);
                Msg.error('Could not save your changes. Please try again');
            }
        })
    });

    btnDone.on('click', function (e) {
        e.preventDefault();

        if (body.hasClass('content-changed')) {
            var c = confirm('Would you like to save changes before leaving the editor?');
            if (c) {
                btnSave.addClass('keditor-needs-destroy').trigger('click');
            } else {
                btnDone.trigger('ktoolbar.done');
            }
        } else {
            btnDone.trigger('ktoolbar.done');
        }

    });

    btnDone.on('ktoolbar.done', function () {
        // Todo: call Keditor destroy or disable method here
        // Just a workaround
        setTimeout(function () {
            window.location.href = window.location.href;
        }, 500);
    });
    
    $('#modal-edit-variables').find('form').forms({
        onSuccess: function () {
            Msg.success('Theme variables are saved! Reloading page...');
            window.location.reload();
        }
    });

    window.onbeforeunload = function () {
        if (body.hasClass('content-changed')) {
            return 'Are you sure to leave the editor? You will lose any unsaved changes';
        }
    };
});