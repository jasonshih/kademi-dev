(function ($) {

    function initCreateMemberForm() {
        var modal = $('#modal-add-member');
        var form = modal.find('form');

        form.forms({
            onSuccess: function (resp) {
                modal.modal('hide');
            }
        });

        $('body').on('hidden.bs.modal', '#modal-add-member', function () {
            form.trigger('reset');
        });
    }

    $(function () {
        initCreateMemberForm();
    });
})(jQuery);