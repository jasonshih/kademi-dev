(function ($) {
    $(function () {
        var auctionsList = $('#auctions-list');
        
        if (auctionsList.length > 0) {
            auctionsList.find('.auction').each(function () {
                initAuctionCountDown($(this), true);
            });
        }
    });
    
})(jQuery);
