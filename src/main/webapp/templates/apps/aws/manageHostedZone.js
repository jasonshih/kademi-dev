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

    function initDeleteRecord() {
        $('body').on('click', '.btn-delete-record', function (e) {
            e.preventDefault();

            var btn = $(this);
            var tr = btn.closest('tr');
            var rType = tr.data('type');
            var name = tr.data('name');

            if (confirm('Are you sure you want to delete this record?')) {
                $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        deleteRecord: true,
                        type: rType,
                        name: name
                    },
                    success: function (data, textStatus, jqXHR) {
                        if (data.status) {
                            reloadRecords();
                        }
                    }
                });
            }
        });
    }

    function reloadRecords() {
        $('#records-tbody').reloadFragment();
    }

    $(function () {
        initNewRecordModal();
        initRecordTypeSelect();
        initDeleteRecord();
    });
})();