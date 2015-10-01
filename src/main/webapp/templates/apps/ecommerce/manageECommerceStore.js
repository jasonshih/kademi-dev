function initManageECommerceStore() {
    initDetailsForm();
}

function initDetailsForm() {
    var detailsForm = $('#detailsForm');

    detailsForm.forms({
        callback: function (resp) {
            if (resp.status) {
                Msg.info(resp.messages.first());
            }
        }
    });
}