(function ($) {
    $(function () {
        flog('Init dashboard-alert from "alerts-lib"');
        
        $('.dashboard-alert').bind('closed.bs.alert', function (e) {
            var href = $(this).closest("div").find("a.msg").attr("href");
            
            if (href) {
                ackAlert(href);
            }
        })
    });
    
    function ackAlert(href) {
        $.ajax({
            type: 'POST',
            url: href,
            dataType: "json",
            data: {
                ack: true
            },
            success: function (data) {
                flog("acked", data);
            },
            error: function (resp, textStatus, errorThrown) {
                alert("Error querying the list of organisations");
            }
        });
    }
    
})(jQuery);