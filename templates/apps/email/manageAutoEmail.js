function initManageEmailTrigger() {
    initModalAddEmailTrigger();
    initFormTriggers();
}

function initManageAutoEmails() {
    initModalAddEmailTrigger();
    initDeleteEmail();
}

function initModalAddEmailTrigger() {
    flog("initModalAddEmail");
    var modal = $('#modal-add-email');

    modal.find('form').forms({
        validate: function(form) {
            flog("manageEmail.js: check radio", form);
            return checkRadio("eventId", form);
        },
        callback: function(data) {
            flog('saved ok', data);
            modal.modal('hide');
            Msg.success($('#name').val() + ' is created!');
            $('#email-trigger-wrapper').reloadFragment();
        }
    });
}

function initFormTriggers() {
    $('.form-triggers').forms({
        callback: function() {
            window.location.reload();
        }
    });
}

function initManageAutoEmail() {
    flog("initManageAutoEmail");
    initHtmlEditors($('.htmleditor'), getStandardEditorHeight(), null, null, 'autogrow');
    initAttachment();
    initFormDetailEmail();
    initIncludeUser();
    initEventType();
    initAdvanceRecipients();
    initSendTest();
    initChooseGroup();

    $('#action .toggler').on({
        'checked.toggled': function(e, panel) {
            $(panel).find('select, input, textarea').not(':hidden').addClass('required');
        },
        'unchecked.toggled': function(e, panel) {
            $(panel).find('select, input, textarea').not(':hidden').removeClass('required');
        }
    });

    var toggledPanel = $('.panel-toggled');
    toggledPanel.each(function () {
        var panel = $(this);
        if (panel.is(':hidden')) {
            panel.find('select, input, textarea').not(':hidden').removeClass('required');
        } else {
            panel.find('select, input, textarea').not(':hidden').addClass('required');
        }
    });

    flog("initManageAutoEmail - DONE");
}

function initEventType() {
    var eventType = $('.event-type');
    var chkEventId = $('#eventId');
    var checkEventId = function() {
        flog('checkEventId');
        var eventId = chkEventId.val();
        flog('changed', eventId);
        eventType.hide().find('select, input').attr('disabled', true);
        eventType.filter('.' + eventId).show().find('select, input').attr('disabled', false);
    };

    checkEventId();
    chkEventId.on('change', function() {
        checkEventId();
    });
}

function initIncludeUser() {
    var chkIncludeUser = $('#includeUser');

    chkIncludeUser.on('change', function() {
        var isIncludeUser = chkIncludeUser.is(':checked');
        flog('includeUser', includeUser);
        $.ajax({
            type: 'POST',
            url: window.location.href,
            data: {
                includeUser: isIncludeUser
            },
            error: function(resp) {
                flog('error', resp);
                Msg.error('err');
            }
        });
    });
}

function initAttachment() {
    var attachmentsList = $('.attachments-list');

    $('.add-attachment').mupload({
        buttonText: '<i class="clip-folder"></i> Upload attachment',
        useJsonPut: false,
        oncomplete: function(data, name) {
            flog('oncomplete. name=', name, 'data=', data);
            showAttachment(data, attachmentsList);
        }
    });

    attachmentsList.on('click', '.btn-delete-attachment', function(e) {
        e.preventDefault();

        var btn = $(this);
        var href = btn.attr('href');

        doRemoveAttachment(href, function() {
            btn.closest('article').remove();
        });
    });
}

function showAttachment(data, attachmentsList) {
    flog('attach', data);

    var name = data.name;
    var hash = data.result.nextHref;

    attachmentsList.append(
            '<article>' +
            '<span class="article-name">' +
            '<a target="_blank" href="/_hashes/files/' + hash + '">' + name + '</a>' +
            '</span>' +
            '<aside class="article-action">' +
            '<a class="btn btn-xs btn-danger btn-delete-attachment" href="' + name + '" title="Remove"><i class="clip-minus-circle"></i></a>' +
            '</aside>' +
            '</article>'
            );
}

function doRemoveAttachment(name, callback) {
    if (confirm("Are you sure you want to delete attachment " + name + "?")) {
        try {
            $.ajax({
                type: 'POST',
                url: window.location.pathname,
                data: {
                    removeAttachment: name
                },
                success: function(data) {
                    flog('saved ok', data);
                    callback();
                },
                error: function(resp) {
                    flog('error', resp);
                    Msg.error('Sorry, we couldnt remove the attachment. Please refresh the page and try again');
                }
            });
        } catch (e) {
            Msg.error('Sorry, we couldnt remove the attachment. Please refresh the page and try again');
        }
    }
}