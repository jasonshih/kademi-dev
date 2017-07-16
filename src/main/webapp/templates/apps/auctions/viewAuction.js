function initViewAuction(WSUri) {
    $('abbr.timeago').timeago();
    bidForm();
    initWebsockets(WSUri);
}

function initWebsockets(WSUri) {
    var path = getAuctionPath(window.location.pathname);
    flog("initWebsockets", window.location.host, "ws://" + window.location.host + "/comments/" + window.location.host + "/auctionBid/" + WSUri);
    try {
        wsocket = new WebSocket("ws://" + window.location.host + "/comments/" + window.location.host + "/auctionBid/" + WSUri);
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
        onSuccess: function (resp) {
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