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
            
            Kalert.confirm('Your will not be able to recover this api app!', 'Yes, delete it!', function () {
                return $.ajax({
                    type: 'DELETE',
                    url: href,
                    dataType: 'json',
                    success: function () {
                        refreshTable();
                        Msg.success('Deleted!', 'Your API App has been deleted');
                        Kalert.close();
                    },
                    error: function () {
                        Msg.error('Oh No!', 'Sorry, an error occured deleting ' + href + '. Please check your internet connection');
                        Kalert.close();
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