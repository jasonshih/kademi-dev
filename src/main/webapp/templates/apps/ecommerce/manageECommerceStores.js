function initManageECommerceStores() {
    initCreateModal();
    initDeleteStore();
    
    flog("init settings form", $("#settingsForm"));
    $("#settingsForm").forms({
        onSuccess : function(resp) {
            if( resp.status ) {
                Msg.info(resp.messages[0]);
            } else {
                Msg.error(resp.messages[0]);
            }
        }
    });
}

function initCreateModal() {
    var modal = $('#addStoreModal');
    var modalForm = modal.find('form');

    modalForm.forms({
        onSuccess: function (resp) {
            if (resp.status) {
                modal.modal('hide');
                Msg.info(resp.messages[0]);
                $('#stores-table').reloadFragment();
            }
        }
    });
}

function initDeleteStore() {
    $('body').on('click', '.delete-store', function (e) {
        e.preventDefault();

        var btn = $(this);
        var row = btn.closest('tr');
        var href = btn.attr('href');
        var title = btn.data('title');

        confirmDelete(href, title, function () {
            row.remove();
        });
    });
}