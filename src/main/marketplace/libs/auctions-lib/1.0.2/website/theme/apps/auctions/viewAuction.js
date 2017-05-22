function initViewAuction(WSUri) {
    $('abbr.timeago').timeago();
    bidForm();
    initWebsockets(WSUri);
}

function initWebsockets(WSUri) {
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
                processReceivedBid(c);
            }else{ // Bid must be closing
                $("#bidFromDiv").hide();
                Msg.info("Auction is closing, no more bids will be accepted.")
            }
        };
        log("done initWebsockets");
    } catch (e) {
        // TODO: setup polling to load comments every minute or so
        log("Websocket initialisation failed. Live bid stream is not available");
    }
}

function processReceivedBid(c) {
    var dt = moment(c.bidDate);
    $('#bidHistory tbody').prepend('<tr><td>' + c.bidValue.toFixed(2) + '</td><td><abbr title="' + dt.format(moment.ISO_8601) + '" class="timeago">' + dt.format() + '</abbr></td><td><a href="' + c.bidderHref + '" > ' + c.bidderName + ' </a></td></tr>');
    if($('#bidHistory tr').length > 5){
        $('#bidHistory tr:last').remove();
    }
    $('abbr.timeago').timeago();
    $('#bidCurrentValue').text(c.auctionCurrentBidValue);
    $('#bidCount').text(c.auctionCurrentBidCount);
}

function bidForm() {
    $("#bidForm").forms({
        callback: function (resp) {
            flog("done", resp);
            console.log(resp);
            if (!window.WebSocket) {
                $("#BidInfo").reloadFragment({
                    whenComplete: function () {
                        $('abbr.timeago').timeago();
                        bidForm();
                    }
                });
            }
            Msg.success('Bid Placed');
        },
        error: function (resp) {
            flog("error", resp);
            //Msg.error("Incorrect Value");
        }
    });
}

function getAuctionPath(path) {
    path = stripFragment(path); // remove any fragment like #section
    if (path.endsWith('/')) {
        path = path.substring(0, path.length - 1);
    }
    var pos = path.lastIndexOf('/');
    return path.substring(pos + 1);
}