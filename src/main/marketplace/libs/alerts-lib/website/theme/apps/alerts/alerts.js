(function ($) {
    $(function () {
        flog('Init dashboard-alert from "alerts-lib"');
        
        $('.dashboard-alert').bind('closed.bs.alert', function () {
            var id = $(this).closest('div').find('a.msg').attr('data-id');
            
            if (id) {
                ackAlert(id);
            }
        })
    });
    
    function ackAlert(id) {
        $.ajax({
            type: 'POST',
            url: '/alert-ack/',
            dataType: 'json',
            data: {
                ackId: id
            },
            success: function (data) {
                flog('Acked', data);
            },
            error: function (resp, textStatus, errorThrown) {
                flog('Error querying the list of organisations', resp, textStatus, errorThrown);
                alert('Error querying the list of organisations');
            }
        });
    }
    
})(jQuery);