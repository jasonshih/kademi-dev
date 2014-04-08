function initManageEmail() {
    initModalAddEmail();
    initDeleteEmail();
}

function initModalAddEmail() {
    var modal = $('#modal-add-email');

    modal.find('form').forms({
        callback: function(data) {
            flog('saved ok', data);
            modal.modal('hide');
            window.location.href = data.nextHref;
        }
    });
}

function initDeleteEmail() {
    //Bind event for Delete email
    $('body').on('click', 'a.btn-delete-email', function(e) {
        e.preventDefault();

        var btn = $(e.target);
        flog('do it', btn);

        var href = btn.attr('href');
        var name = getFileName(href);

        confirmDelete(href, name, function() {
            flog('remove', btn);
            btn.closest('tr').remove();
        });
    });
}

function initChooseGroup() {
    initChooseGroupModal();
    initRemoveRecipientGroup();
}

function initChooseGroupModal() {
    var modal = $('#modal-choose-group');

    modal.find('input:radio').on('click', function() {
        var radioBtn = $(this);

        flog('a');

        flog("radiobutton click", radioBtn, radioBtn.is(":checked"));
        setGroupRecipient(radioBtn.attr('name'), radioBtn.val());
    });
}

function setGroupRecipient(name, groupType) {
    flog("setGroupRecipient", name, groupType);
    try {
        $.ajax({
            type: 'POST',
            url: window.location.href,
            data: {
                group: name,
                groupType: groupType
            },
            success: function(data) {
                flog("saved ok", name);

                var blockWrapper = $('#recipients').find('.blocks-wrapper');
                blockWrapper.find('.block.' + name).remove();

                flog("add to list");
                blockWrapper.filter('.' + groupType).append(
                        '<span class="block ' + name + '">' +
                        '<span class="block-name">' + name + '</span>' +
                        '<a class="btn btn-xs btn-danger btn-remove-role" href="' + name + '" title="Remove this role"><i class="clip-minus-circle "></i></a>' +
                        '</span>'
                        );
            },
            error: function(resp) {
                flog("error", resp);
                alert("err");
            }
        });
    } catch (e) {
        flog("exception in createJob", e);
    }
}

function initRemoveRecipientGroup() {
    var blockWrapper = $('#recipients');
    flog('initRemoveRecipientGroup');

    blockWrapper.on('click', '.btn-remove-role', function(e) {
        flog('click', this);
        e.preventDefault();
        e.stopPropagation();

        if (confirm('Are you sure you want to remove this group?')) {
            var btn = $(this);
            flog('do it', btn);

            var href = btn.attr('href');
            deleteFile(href, function() {
                btn.closest('span.block').remove();
                $('#modal-choose-group').find('input:radio').filter('[name=' + href + ']').removeAttr('checked');
            });
        }
    });
}

function initAdvanceRecipients() {
    var showAdvanced = $('#showAdvanced');
    var scriptXml = $('textarea[name=filterScriptXml]');

    if (scriptXml.val().length > 0 && !showAdvanced.is(':checked')) {
        flog('show adv');
        showAdvanced.trigger('click');
    }
}

function initFormDetailEmail() {
    $('form[name=frmDetails]').forms({
        valiationMessageSelector: ".page-validation",        
        callback: function() {
            $('body').removeClass('dirty');
            alert('Saved');
        }
    });
}