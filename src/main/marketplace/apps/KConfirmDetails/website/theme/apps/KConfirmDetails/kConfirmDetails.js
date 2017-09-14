(function ($) {
    $(function () {
        var confirmDetailsModal = $("#modal-confirm-details");
        if (confirmDetailsModal !== undefined) {
            console.log("KConfirmDetails");
            confirmDetailsModal.modal("show");

            $('#confirmDetailsForm').forms({
                onSuccess: function (resp, form) {
                    flog('kConfirm :: ', resp);
                    if (resp === undefined || resp.status === false) {
                        Msg.info('There was an error updating the profile.');
                    } else {
                        confirmDetailsModal.modal("hide");
                        
                    }
                }
            });
        }
    });
})(jQuery);