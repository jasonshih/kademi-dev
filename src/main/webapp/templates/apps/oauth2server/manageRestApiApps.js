(function ($) {

    function initCreateApiApp() {
        $('body').on('click', '.btn-create-app', function (e) {
            e.preventDefault();

            swal({
                title: "Create a new API App",
                text: "Rest API App Display Name:",
                type: "input",
                showCancelButton: true,
                closeOnConfirm: false,
                showLoaderOnConfirm: true,
                inputPlaceholder: "e.g. My App"
            }, function (inputValue) {
                if (inputValue === false)
                    return false;
                if (inputValue === "") {
                    swal.showInputError("Please enter a display name");
                    return false
                }

                $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        createRestApiApp: true,
                        title: inputValue
                    },
                    success: function (resp, textStatus, jqXHR) {
                        if (resp.status) {
                            refreshTable();
                            swal("Success", resp.messages[0], "success");
                        } else {
                            swal("Oh No!", resp.messages[0], "danger");
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {

                    }
                });
            });
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