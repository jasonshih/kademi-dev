// Main initialiser functions go at the top
function initManageOrgTypes() {
    flog("initManageOrgTypes");
    ModalAddOrgType.init();
    ModalEditOrgType.init();
    initCRUDOrgType();
    initManageOrgTypeModal();
}

function initManageOrgTypeModal() {
    var $body = $("body");

    $body.on('click', '.btn-add-field', function(e) {
        e.preventDefault();

        var name = prompt('Please enter a name for the new field');

        if (name === '') {
            return;
        } else if (name.contains(' ')) {
            Msg.error('Please enter a name without spaces or other special characters');
            return;
        }

        $('.fields').append(
                '<div class="form-group">' +
                '<label for="field-' + name + '" class="control-label col-md-4">' + name + '</label>' +
                '<div class="col-md-8">' +
                '<div class="input-group">' +
                '<input type="text" class="form-control" id="field-' + name + '" name="field-' + name + '" value="" />' +
                '<span class="input-group-btn">' +
                '<a href="' + name + '" class="btn btn-default btn-delete-field" title="Delete this field" role="button">&times;</a>' +
                '</span>' +
                '</div>' +
                '</div>' +
                '</div>'
                );
    });

    $body.on('click', '.btn-delete-field', function(e) {
        e.preventDefault();

        var $btnDelete = $(this);

        if (confirm('Do you want to delete "' + $btnDelete.attr('href') + '"')) {
            $btnDelete.parents('.form-group').remove();
        }
    });
}

// I think having a type for this is going overboard, we're just showing a modal
// and submittting a form
var ModalAddOrgType = {
    init: function() {
        var self = this;

        self.$modal = $('#modal-new-orgtype').modal({
            show: false
        });
        self.$form = self.$modal.find('form');
        self.$input = self.$form.find('input');

        self.$form.forms({
            callback: function(resp) {
                log('done new org type', resp);
                self.hide();
                Msg.success(self.$modal.find('[name=displayName]').val() + ' is created!');
                $('#org-types').reloadFragment();
            }
        });
    },
    show: function() {
        this.$input.val('');
        this.$modal.modal('show');
    },
    hide: function() {
        this.$modal.modal('hide');
    }
};

function initCRUDOrgType() {
    var $body = $("body");

    $body.on('click', '.btn-edit-orgtype', function(e) {
        e.preventDefault();

        ModalEditOrgType.show($(this).attr('href'));
    });

    $body.on('click', '.btn-delete-orgtype', function(e) {
        e.preventDefault();

        var btn = $(this);
        var href = btn.attr('href');
        var name = getFileName(btn.prop('href'));

        log('delete', href);
        confirmDelete(href, getFileName(href), function() {
            log('remove ', this);
            Msg.success(name + ' is removed!');
            $('#org-types').reloadFragment();
        });
    });

    $('.btn-add-type').on('click', function(e) {
        e.preventDefault();

        ModalAddOrgType.show();
    });
}

var ModalEditOrgType = {
    init: function() {
        var self = this;
    
        self.modal = $('#modal-edit-orgtype').modal({
            show: false
        });
        self.formContent = self.modal.find('.form-content');
    },
    show: function(href) {
        var self = this;
        var modal = self.modal;
        var formContent = self.formContent;
        var manageOrgTypes = $('#manage-org-types');
    
        formContent.load(href + ' #modal-edit-orgtype', function () {
            formContent.find('form').forms({
                callback: function(resp) {
                    log('done', resp);
                    self.hide();
                    Msg.success(formContent.find('[name=displayName]').val() + ' is saved!');
                    $('#org-types').reloadFragment();
                }
            });

            log('done forms', modal);

            modal.modal('show');

            log('showed modal');
        });
    },
    hide: function() {
        this.modal.modal('hide');
    }
}


