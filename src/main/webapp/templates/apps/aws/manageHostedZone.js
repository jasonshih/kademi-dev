(function () {
    function initNewRecordModal() {
        var modal = $('#addRecordModal');
        var form = modal.find('form');

        form.forms({
            onSuccess: function (resp) {
                reloadRecords();
                form.trigger('reset');
                $('#record-type').change();
                modal.modal('hide');
            }
        });
    }

    function initRecordTypeSelect() {
        $('#record-type').on('change', function (e) {
            var inp = $(this);

            $('[id^=record-type-]').hide();

            $('#record-type-' + inp.val()).show();
        });
    }

    function reloadRecords() {
        $('#records-tbody').reloadFragment();
    }

    $(function () {
        initNewRecordModal();
        initRecordTypeSelect();
    });
})();