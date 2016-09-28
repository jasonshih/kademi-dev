$(function () {
    var panel = $('.panel-coming-up-auction');

    if (panel.length > 0) {
        var countdown = panel.find('.countdown');
        var finalDate = countdown.attr('data-end');
        var WSUri = countdown.attr('data-WSUri');
        initWebsockets(WSUri, panel);
        var c = moment(finalDate).format('YYYY/MM/DD HH:MM:ss');

        countdown.countdown(c)
            .on('update.countdown', function (event) {
                var format = '%H:%M:%S';
                if (event.offset.days > 0) {
                    format = '%-d day%!d ' + format;
                }
                if (event.offset.weeks > 0) {
                    format = '%-w week%!w ' + format;
                }
                $(this).html(event.strftime(format));
            })
            .on('finish.countdown', function (event) {
                $(this).html('This auction has expired!')

            });
    }

    function initWebsockets(WSUri, panel) {
        flog("initWebsockets", window.location.host, "ws://" + window.location.host + "/comments/" + window.location.host + "/auctionBid/" + WSUri);
        try {
            wsocket = new WebSocket("ws://" + window.location.host + "/comments/" + window.location.host + "/auctionBid/" + WSUri);
            wsocket.onmessage = function (evt) {
                var c = $.parseJSON(evt.data);
                if (c.beanType != null && c.beanType == "auctionBid") {
                    log("onMessage", c);
                    var dt = moment(c.bidDate);
                    flog("Received Date: ", dt);
                    panel.find('.bidValue').text(c.bidValue);
                } else { // Bid must be closing
                    panel.reloadFragment();
                    Msg.info("Auction is closing, no more bids will be accepted.")
                }
            };
            log("done initWebsockets");
        } catch (e) {
            // TODO: setup polling to load comments every minute or so
            log("Websocket initialisation failed. Live bid stream is not available");
        }
    }

});
