/**
 * Created by Anh on 8/22/2016.
 */
var startFrom = 100;
$(function () {
    if (!window.contentEditing && $('.rewardStoreCategoryProductsComponent').length){
        initSearchProduct();
        $(window).scroll(function () {
            if ($(window).scrollTop() == $(document).height() - $(window).height()) {
                doPaginate();
            }
        });
    }
});

function initSearchProduct() {
    $("[data-type=component-searchBox] [name=q]").keyup(function () {
        typewatch(function () {
            flog("do search");
            doProductSearch();
        }, 500);
    });
}

function doProductSearch() {
    var query = $("[data-type=component-searchBox] [name=q]").val();
    flog("doSearch", query);
    var newUrl = window.location.pathname + "?q=" + query;
    window.history.replaceState("", "", newUrl);
    $.ajax({
        type: 'GET',
        url: newUrl,
        success: function (data) {
            flog("success", data);
            var fragment = $(data).find("#products-list");
            $("#products-list").replaceWith(fragment);
        },
        error: function (resp) {
            Msg.error("An error occured doing the product search. Please check your internet connection and try again");
        }
    });
}

function doPaginate() {
    var query = $("[data-type=component-searchBox] [name=q]").val();
    flog("doSearch", query);
    var newUrl = window.location.pathname + "?q=" + query + "&fromRange=" + startFrom;
    $('#inifiniteLoader').show();
    $.ajax({
        type: 'GET',
        url: newUrl,
        success: function (data) {
            flog("success", data);
            var fragment = $(data).find("#products-list");
            var products = fragment.find('.product-item');
            $("#products-list .row").append(products);
            startFrom = startFrom + 100;
            $('#inifiniteLoader').hide();
        },
        error: function (resp) {
            Msg.error("An error occured doing the product search. Please check your internet connection and try again");
            $('#inifiniteLoader').hide();
        }
    });
}