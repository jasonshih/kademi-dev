(function ($) {
    $(function () {
        var panelBidForm = $('.panel-auction-bid-form');
        
        if (panelBidForm.length > 0) {
            panelBidForm.find('.timeago').timeago();
            initBidForm(panelBidForm);
            initWebsockets(panelBidForm.attr('data-ws-uri'), panelBidForm);
        }
    });
    
    function initBidForm(panel) {
        flog('initBidForm', panel);
        
        panel.find('form').forms({
            onSuccess: function (resp) {
                if (!window.WebSocket) {
                    panel.closest('[data-dynamic-href]').reloadFragment({
                        whenComplete: function () {
                            panel.find('.timeago').timeago();
                            initBidForm(panel);
                        }
                    });
                }
                
                Msg.success('Bid Placed');
            }
        });
    }
    
    function initWebsockets(wsUri, panel) {
        try {
            var port = parseInt(window.location.port || 80) + 1;
            var proto = 'ws://';
            if (window.location.protocol === 'https:') {
                proto = 'wss://';
                port = parseInt(window.location.port || 443) + 1;
            }
            var wsPath = proto + window.location.hostname + ':' + port + '/comments/' + window.location.hostname + '/auctionBid/' + wsUri;
            
            flog('initWebsockets', window.location.hostname, wsPath);
            
            var wsocket = new WebSocket(wsPath);
            wsocket.onmessage = function (evt) {
                var data = $.parseJSON(evt.data);
                if (data && data.beanType == 'auctionBid') {
                    if (data.action == "BID_PLACED"){
                        processReceivedBid(data, panel);
                    } else {
                        flog('You were outbid');
                    }
                } else {
                    Msg.info('Auction is closing, no more bids will be accepted.')
                    panel.closest('[data-dynamic-href]').reloadFragment({
                        whenComplete: function () {
                            panel.find('.timeago').timeago();
                        }
                    });
                }
            };
        } catch (e) {
            flog('Websocket initialisation failed. Live bid stream is not available');
        }
    }
    
    function processReceivedBid(data, panel) {
        var dt = moment(data.bidDate);
        
        var bidHistoryBody = $('#auction-bid-history tbody');
        if (bidHistoryBody.length > 0) {
            if (bidHistoryBody.find('[colspan]').length > 0) {
                bidHistoryBody.html('');
            }
            
            bidHistoryBody.prepend(
                '<tr>' +
                '    <td>' + data.bidValue.toFixed(2) + '</td>' +
                '    <td><abbr title="' + dt.toISOString() + '" class="timeago">' + dt.format() + '</abbr></td>' +
                '    <td><a href="' + data.bidderHref + '" target="_blank"> ' + data.bidderFormattedName + ' </a></td>' +
                '</tr>'
            );
            
            bidHistoryBody.find('.timeago').timeago();
        }
        
        panel.find('#auction-current-bid-value').text(data.auctionCurrentBidValue);
        panel.find('#auction-bid-count').text(data.auctionCurrentBidCount);
    }
    
})(jQuery);
