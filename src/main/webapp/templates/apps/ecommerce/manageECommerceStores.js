function initManageECommerceStores() {
    initCreateModal();
}

function initCreateModal() {
    var modal = $('#addStoreModal');
    var modalForm = modal.find('form');

    modalForm.forms({
        callback: function (resp) {
            if (resp.status) {
                modal.modal('hide');
                Msg.info(resp.messages.first());
            }
        }
    });
}