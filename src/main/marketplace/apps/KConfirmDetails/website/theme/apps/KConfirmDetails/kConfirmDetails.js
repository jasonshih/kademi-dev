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

                        var userName = $("#userName").val();
                        var groupName = $("#groupName").val();
                        flog('userName= ', userName, 'groupName= ', groupName);
                        $.ajax({
                            type: "POST",
                            url: '/confirm-details',
                            data: {userName: userName, groupName: groupName},
                            success: function (resp) {
                                console.log(resp);
                            }
                        });

                    }
                }
            });
        }
    });
})(jQuery);