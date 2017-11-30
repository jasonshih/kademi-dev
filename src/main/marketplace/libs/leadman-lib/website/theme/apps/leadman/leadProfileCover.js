(function($){
    $(document).ready(function(){
        if($('.lead-profile-cover-component').length > 0) {
            var form = $("#leadDetails");
            form.forms({
                onSuccess: function (resp) {
                    Msg.info('Saved');
                }
            });
            initNewProfileLeadForm();
            initDeleteCustomer();
            initAssignOrg();

            $('.modal').on('hidden.bs.modal', function () {
                var form = $(this).find('form');
                form.trigger('reset');
                $('input[name=newOrgId]', form).val('');
            });
        }
    });

})(jQuery);
