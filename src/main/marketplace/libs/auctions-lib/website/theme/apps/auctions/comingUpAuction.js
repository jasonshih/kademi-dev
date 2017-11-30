(function ($, window) {
    $(function () {
        var panel = $('.panel-coming-up-auction');
        
        if (panel.length > 0) {
            var countdown = panel.find('.countdown');
            var WSUri = countdown.attr('data-WSUri');
            initWebsockets(WSUri, panel);
            initAuctionCountDown(panel);
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
    
    window.initAuctionCountDown = function (panel, timeOnly) {
        flog('initAuctionCountDown', panel);
        
        var countdown = panel.find('.countdown');
        var finalDate = countdown.attr('data-end');
        
        if (finalDate) {
            var c = moment(finalDate).format('YYYY/MM/DD HH:MM:ss');
            
            countdown.countdown(c).on({
                'update.countdown': function (event) {
                    var format = '';
                    
                    if (timeOnly) {
                        var totalTimes = event.offset.hours;
                        totalTimes += event.offset.days * 24;
                        totalTimes += event.offset.weeks * 7 * 24;
                        
                        format = totalTimes + ':%M:<span>%S</span>';
                    } else {
                        format = '%H:%M:<span>%S</span>';
                        if (event.offset.days > 0) {
                            format = '%-d day%!d ' + format;
                        }
                        if (event.offset.weeks > 0) {
                            format = '%-w week%!w ' + format;
                        }
                    }
                    
                    $(this).html(event.strftime(format));
                },
                'finish.countdown': function () {
                    $(this).html('This auction has expired!')
                }
            });
        }
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
    
})(jQuery, window);