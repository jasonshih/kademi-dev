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
            alert('Please enter a name without spaces or other special characters');
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
                window.location.reload();
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

        var href = $(this).attr('href');

        log('delete', href);
        confirmDelete(href, getFileName(href), function() {
            log('remove ', this);
            win.location.reload();
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

        self.$modal = $('#modal-edit-orgtype').modal({
            show: false
        });
        self.$modalBody = self.$modal.find('.modal-body');
    },
    show: function(href) {
        var self = this;
        var modal = self.$modal;
        var modalBody = self.$modalBody;
        var manageOrgTypes = $('#manage-org-types');

        modalBody.load(href + ' #modal-edit-orgtype', function() {
            modalBody.find('form').forms({
                callback: function(resp) {
                    log('done', resp);
                    self.hide();
                    manageOrgTypes.load(window.location.pathname + ' #manage-org-types > *', function() {

                    });
                }
            });

            log('done forms', modal);

            modal.modal('show');

            log('showed modal');
        });
    },
    hide: function() {
        this.$modal.modal('hide');
    }
}


