(function($){
    window.removeQuote = function(href, quoteId) {
        confirmDelete(href, getFileName(href), function (data) {
            $("#quoteComponent").reloadFragment({
                whenComplete: function () {
                    $('abbr.timeago').timeago();
                }
            });
        });
    }

})(jQuery);
