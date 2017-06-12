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
            
            Konfirm.error({
                message: 'Your will not be able to recover this api app!',
                confirmText: 'Yes, delete it!'
            }, function () {
                $.ajax({
                    type: 'DELETE',
                    url: href,
                    dataType: 'json',
                    success: function () {
                        refreshTable();
                        Kalert.success('Deleted!', 'Your API App has been deleted');
                    },
                    error: function () {
                        Kalert.error('Oh No!', 'Sorry, an error occured deleting ' + href + '. Please check your internet connection');
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