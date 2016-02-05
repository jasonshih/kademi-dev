(function (w) {
    function initModalForm() {
        var modal = $('#addLocationModal');
        var form = modal.find('form');

        form.forms({
            onSuccess: function (data) {
                reloadTable();
                modal.modal('hide');
            }
        });

        modal.on('bs.modal.hidden', function () {
            form.trigger('reset');
        });
    }

    function reloadTable() {
        $('#productsTableContainer').reloadFragment();
    }

    w.initManageInventory = function () {
        initModalForm();
    };
})(window);