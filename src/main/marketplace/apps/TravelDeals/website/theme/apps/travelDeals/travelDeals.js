(function ($) {
    // Find enquiry components
    function initEnquiryComponent() {
        $('.travelDeals-enquiryComponent').each(function (i, item) {
            var comp = $(item);
            var modal = comp.find('.travelDeals-enquireModal');
            var form = modal.find('form');

            modal.find('.travelDeals-datePicker').datetimepicker({
                showTodayButton: true,
                format: 'DD/MM/YYYY'
            });

            form.forms({
                onSuccess: function (resp) {
                    flog('onSuccess', resp);
                    form.trigger('reset');
                    modal.modal('hide');
                    Msg.success(resp.messages);
                },
                onError: function (resp) {
                    flog('onError', resp);
                    Msg.success('Oh No! Someting went wrong!');
                }
            });
        });
    }

    $(function () {
        initEnquiryComponent();
    });
})(jQuery);