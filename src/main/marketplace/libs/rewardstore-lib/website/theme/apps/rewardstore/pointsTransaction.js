$(function () {
    function reloadPointsTx() {
        var c = $('.pointsTransactionTable');
        if (c.length){
            var first = c.first();
            first.reloadFragment({
                url: window.location.href,
                whenComplete: function (resp) {
                    var newHtml = $(resp).find('.pointsTransactionTable');
                    c.each(function (index, item) {
                        $(item).replaceWith(newHtml.eq(index));
                    })
                }
            })
        }
    }

    $(document).on('pageDateChanged', function () {
        reloadPointsTx();
    })
});