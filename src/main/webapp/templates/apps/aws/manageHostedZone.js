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

        modal.find('#record-type').on('change', function (e) {
            var inp = $(this);

            modal.find('[id^=record-type-]').hide();

            modal.find('#record-type-' + inp.val()).show();
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

    function initUpdateRecord() {
        var modal = $('#updateRecordModal');
        var form = modal.find('form');

        $('body').on('click', '.btn-update-record', function (e) {
            e.preventDefault();

            var btn = $(this);
            var tr = btn.closest('tr');
            var record = tr.data('record');

            flog('record', record);

            modal.find('#origName').val(record.name);
            modal.find('#name').val(record.name);

            modal.find('#record-type').val(record.type);
            modal.find('#origType').val(record.type);

            modal.find('[id^=record-type-]').hide();
            modal.find('#record-type-' + record.type).show();

            modal.find('#ttl').val(record.TTL);

            var values = "";
            for (var i in record.resourceRecords) {
                values += record.resourceRecords[i].value + '\r\n';
            }

            if (values.endsWith('\r\n')) {
                values = values.substring(0, values.lastIndexOf('\r\n'));
            }
            modal.find('#value').val(values);

            modal.modal('show');
        });

        form.forms({
            onSuccess: function (resp) {
                reloadRecords();
                modal.modal('hide');
                Msg.success('Successfully updated record.');
            },
            onError: function () {
            }
        });
    }

    function reloadRecords() {
        $('#records-tbody').reloadFragment();
    }

    $(function () {
        initNewRecordModal();
        initDeleteRecord();
        initUpdateRecord();
    });
})();