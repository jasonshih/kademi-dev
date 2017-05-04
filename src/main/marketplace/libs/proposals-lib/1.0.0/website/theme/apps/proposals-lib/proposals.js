$(function () {
    var container = $(".proposals-container");
    
    if (container.length === 0) {
        return;
    }
    flog("init proposals");
    $("body").on("click", ".proposal-accept-btn", function (e) {
        e.preventDefault();
        
        var btn = $(e.target).closest("a");
        var quoteId = btn.data("quote");
        var href = btn.attr("href");
        
        flog("proposals accept click..", quoteId);
        
        $.ajax({
            type: 'POST',
            url: href,
            datatype: 'json',
            data: {
                approveQuote: quoteId
            },
            success: function (data) {
                if (data.status) {
                    Msg.info('Quote Accepted Successfully');
                } else {
                    if (data.messages.length > 0) {
                        Msg.error(data.messages[0]);
                    } else {
                        Msg.error('An error occured accepting the quote');
                    }
                }

                /*
                 container.find(".proposal-quotes").hide();
                 container.find(".proposal-thankyou").show();*/
            },
            error: function (resp) {
                Msg.error('An error occured accepting the quote');
            }
        });
    });
});