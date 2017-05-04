$(function () {
    var container = $(".proposals-container");

    if (container.length === 0) {
        return;
    }
    flog("init proposals");
    $("body").on("click", ".proposal-accept-btn", function (e) {
        if (!confirm("Are you sure you want to accept this quote?")) {
            return;
        }

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
                if (!data.status) {
                    if (data.messages.length > 0) {
                        Msg.error(data.messages[0]);
                    } else {
                        Msg.error('An error occured accepting the quote');
                    }
                } else {
                    container.find(".proposals-container").slideUp(300);
                    container.find(".proposal-thankyou").slideDown(300);
                }
            },
            error: function (resp) {
                Msg.error('An error occured accepting the quote');
            }
        });
    });
});