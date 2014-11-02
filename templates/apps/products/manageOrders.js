var lastSearch = null;

$(function () {
    var rangeInputs = $('.SearchBox input');
    log("init range2");
    lastSearch = $("#dates").val();
    rangeInputs.daterangepicker({
        dateFormat: "dd/mm/yy",
        onClose: function() {
            log("onChange");
            doSearch();
        }
    });

    $(".exportCsv").click(function(e) {
        var a = $(e.target);
        a.attr("href", "orders.csv?q=" + $("#dates").val());
    });

    doSearch();
});

function doSearch() {
    var thisSearch = $("#dates").val();
    if (thisSearch === lastSearch) {
        return;
    }
    log("do search", thisSearch, lastSearch);
    lastSearch = thisSearch;
    var newUrl = window.location.pathname + "?q=" + thisSearch;
    $.ajax({
        type: 'GET',
        url: newUrl,
        success: function(data) {
            log("success", data)
            var $fragment = $(data).find("#orderSearchResults tbody");
            $("#orderSearchResults tbody").replaceWith($fragment);
            window.history.pushState({}, $(data).find("title").text(), newUrl)
            log("pushed new statte", newUrl, window.location.pathname);
        },
        error: function(resp) {
            Msg.error("Sorry, an error occured loading the order search");
        }
    });
}