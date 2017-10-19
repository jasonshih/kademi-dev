$(function () {
    $(".check-all").on('change', function (e) {
        var checkedStatus = this.checked;
        flog("check-all ", checkedStatus);
        $("#lead-tbody").find('.lead-check').prop('checked', checkedStatus);
    });

    function deleteLeads(deleteContact) {
        var ids = [];

        $("#lead-tbody").find('.lead-check:checked').each(function (i, item) {
            var id = $(item).val();
            ids.push(id);
        });

        if (ids.length < 1) {
            Msg.info('Please select at least one lead to delete');
        } else {
            Kalert.confirm('Are you sure you want to delete ' + ids.length + ' lead' + (ids.length > 1 ? 's' : '') + '?', 'Delete', function () {
                $.ajax({
                    type: 'POST',
                    dataType: 'JSON',
                    data: {
                        deleteLeads: ids,
                        deleteContact: deleteContact
                    },
                    success: function (resp) {
                        Kalert.close();

                        if (resp.status) {
                            Msg.success(resp.messages);
                        } else {
                            Msg.warning(resp.messages);
                        }
                        $("#lead-tbody").reloadFragment();
                    },
                    error: function () {
                        Kalert.close();
                        Msg.error('Oh No! Something went wrong!');
                    }
                });
            });
        }

    }

    $(".btn-remove-leads-contacts").on('click', function (e) {
        deleteLeads(true);
    });

    $(".btn-remove-leads").on('click', function (e) {
        deleteLeads(false);
    });
    
});