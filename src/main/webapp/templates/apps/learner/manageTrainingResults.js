(function ($) {
    // Modify Expiry/Renewal Date
    function initEditDates() {
        var modal = $('#modal-learning-editDate');
        var form = modal.find('form');

        $('body').on('click', '.btn-ms-editExpiry', function (e) {
            e.preventDefault();

            var btn = $(this);
            var row = btn.closest('tr');
            var moduleStatusId = row.data('modulestatusid');

            var oldDate = btn.data('date');

            modal.find('[name=moduleStatusId]').val(moduleStatusId);
            modal.find('[name=updateField]').val('expiryDate');
            modal.find('[name=newValue]').val(oldDate);

            modal.modal('show');
        });

        $('body').on('click', '.btn-ms-editRenewal', function (e) {
            e.preventDefault();

            var btn = $(this);
            var row = btn.closest('tr');
            var moduleStatusId = row.data('modulestatusid');

            var oldDate = btn.data('date');

            modal.find('[name=moduleStatusId]').val(moduleStatusId);
            modal.find('[name=updateField]').val('renewalDate');
            modal.find('[name=newValue]').val(oldDate);

            modal.modal('show');
        });

        // Init modal form
        form.forms({
            onSuccess: function (resp) {
                Msg.success(resp.messages);

                modal.modal('hide');
                
                window.location.reload();
            }
        });
    }

    // Run init Methods
    $(function () {
        initEditDates();
    });
})(jQuery);