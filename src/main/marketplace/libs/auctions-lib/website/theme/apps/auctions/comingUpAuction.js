(function ($) {
    $(function () {
        var panel = $('.panel-coming-up-auction');
        
        if (panel.length > 0) {
            var countdown = panel.find('.countdown');
            var WSUri = countdown.attr('data-WSUri');
            initWebsockets(WSUri, panel);
            initCountDown(panel);
            initBidForm(panel);
        }
    });
    
    function initBidForm(panel) {
        flog('initBidForm', panel);
        
        var form = panel.find('form');
        form.forms({
            onSuccess: function () {
                Msg.success('Bid Placed');
            }
        })
    }
    
    function initCountDown(panel) {
        flog('initCountDown', panel);
        
        var countdown = panel.find('.countdown');
        var finalDate = countdown.attr('data-end');
        var c = moment(finalDate).format('YYYY/MM/DD HH:MM:ss');
        
        countdown.countdown(c)
            .on('update.countdown', function (event) {
                var format = '%H:%M:<span>%S</span>';
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
        try {
            var port = parseInt(window.location.port || 80) + 1;
            var proto = 'ws://';
            if (window.location.protocol === 'https:') {
                proto = 'wss://';
                port = parseInt(window.location.port || 443) + 1;
            }
            var wsPath = proto + window.location.hostname + ':' + port + '/comments/' + window.location.hostname + '/auctionBid/' + WSUri;
            
            flog("initWebsockets", window.location.hostname, wsPath);
            
            wsocket = new WebSocket(wsPath);
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
    
})(jQuery);