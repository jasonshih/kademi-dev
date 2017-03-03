(function ($) {

    function initCreateApiApp() {
        var modal = $('#modal-create-app');
        var modalForm = modal.find('form');

        modalForm.forms({
            onSuccess: function (resp) {
                modal.modal('hide');
                Msg.success(resp.messages);
                refreshTable();
            }
        });
    }

    function initDeleteApp() {
        $('body').on('click', '.btn-delete-app', function (e) {
            e.preventDefault();

            var btn = $(this);
            var href = btn.attr('href');

            swal({
                title: "Are you sure?",
                text: "Your will not be able to recover this api app!",
                type: "warning",
                showCancelButton: true,
                confirmButtonClass: "btn-danger",
                confirmButtonText: "Yes, delete it!",
                closeOnConfirm: false,
                showLoaderOnConfirm: true
            },
            function () {
                $.ajax({
                    type: 'DELETE',
                    url: href,
                    dataType: 'json',
                    success: function () {
                        refreshTable();
                        swal('Deleted!', 'Your API App has been deleted', 'success');
                    },
                    error: function () {
                        swal('Oh No!', 'Sorry, an error occured deleting ' + href + '. Please check your internet connection', 'danger');
                    }
                });
            });
        });
    }

    function refreshTable() {
        $('#restApiAppTable').reloadFragment();
    }

    // Run init methods
    $(function () {
        initCreateApiApp();
        initDeleteApp();
    });
})(jQuery);