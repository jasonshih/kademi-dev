(function ($) {
    $(function () {
        var components = $('.claims-list-component');
        
        if (components.length > 0) {
            initModalAddClaim();
        }
    });
    
    function initModalAddClaim() {
        flog('initModalAddClaim');
        
        var modal = $('#modal-add-claim');
        var form = modal.find('.form-new-claim');
        
        flog('===========', modal, form);
        
        form.find('.date-time-picker').each(function () {
            var input = $(this);
            var format = input.attr('data-format') || 'DD/MM/YYYY';
            
            flog(input, format, '==================')
            
            input.datetimepicker({
                format: format
            });
        });
        
        form.forms({
            onSuccess: function () {
                $('#table-claims-body').reloadFragment({
                    whenComplete: function () {
                        Msg.success('New claim is created!');
                        modal.modal('hide');
                    }
                });
            }
        });
    }
    
})(jQuery);