/**
 * Created by Anh on 8/22/2016.
 */
var startFrom = 12;
var currentURI = new URI(window.location.href);

$(function () {
    if (!window.contentEditing && $('.rewardStoreCategoryProductsComponent').length) {
        initPointsRanges();
        initCategories();
        initProductSearch();
        $(window).scroll(function () {
            if (!$('#inifiniteLoader').hasClass('limited') && $('#inifiniteLoader').is(':hidden') && $(window).scrollTop() == $(document).height() - $(window).height()) {
                doPaginate();
            }
        });
    }
});

function initProductSearch() {
    var timer;
    $('#searchBoxInput[data-type=RewardProducts]').on('keydown', function () {
        var input = $(this);

        clearTimeout(timer);
        timer = setTimeout(function () {
            var newUrl = new URI(window.location.href);
            newUrl.setSearch('q', input.val().trim());
            window.history.pushState("", document.title, newUrl.toString());
            doProductSearch();
        }, 300);
    });
}

function initPointsRanges() {
    flog('initPointsRanges');

    var uriSearch = currentURI.search(true);
    var startPrice = uriSearch.startPrice;
    var endPrice = uriSearch.endPrice;
    var pointRangeItems = $('.pointsRangeList a.list-group-item');
    pointRangeItems.filter('[data-startprice="' + startPrice + '"][data-endprice="' + endPrice + '"]').addClass('selected');

    pointRangeItems.on('click', function (e) {
        e.preventDefault();

        var item = $(this);
        var newUrl = new URI(window.location.href);
        newUrl.removeSearch('startPrice');
        newUrl.removeSearch('endPrice');

        pointRangeItems.filter('.selected').removeClass('selected');
        item.addClass('selected');
        newUrl.addSearch('startPrice', item.attr('data-startprice'));
        newUrl.addSearch('endPrice', item.attr('data-endprice'));

        window.history.pushState("", document.title, newUrl.toString());
        doProductSearch();
    });
}

function initCategories() {
    flog('initCategories');
    var categoryItems = $('.rewardStoreCategoriesList a.list-group-item');
    categoryItems.filter('[href='+window.location.pathName+']').addClass('selected');
    categoryItems.on('click', function (e) {
        e.preventDefault();

        categoryItems.filter('.selected').removeClass('selected');
        var item = $(this);
        item.addClass('selected');
        var newUrl = item.attr('href') + window.location.search;

        window.history.pushState("", "", newUrl);
        doProductSearch();
    });
}

function doProductSearch() {
    flog('doProductSearch')
    $("#products-list").html('');
    var inifiniteLoader = $('#inifiniteLoader');
    inifiniteLoader.show();

    $.ajax({
        type: 'GET',
        url: window.location.href,
        success: function (data) {
            // flog("success", data);
            var fragment = $(data).find("#products-list");
            $("#products-list").replaceWith(fragment);
            // truncateProductContent();
            startFrom = 12;
            inifiniteLoader.removeClass('limited').hide();
        },
        error: function (resp) {
            inifiniteLoader.removeClass('limited').hide();
            Msg.error("An error occurred doing the product search. Please check your internet connection and try again");
        }
    });
}

function doPaginate() {
    var newUrl = new URI(window.location.href);
    newUrl.addSearch('fromRange', startFrom);
    var inifiniteLoader = $('#inifiniteLoader');
    inifiniteLoader.show();

    $.ajax({
        type: 'GET',
        url: newUrl.toString(),
        success: function (data) {
            flog("success");
            var fragment = $(data).find("#products-list");
            var products = fragment.find('.product-item');

            if (products.length > 0) {
                $("#products-list .row").append(products);
                // truncateProductContent();
                startFrom = startFrom + 12;
            } else {
                inifiniteLoader.addClass('limited');
            }

            inifiniteLoader.hide();
        },
        error: function (resp) {
            Msg.error("An error occured doing the product search. Please check your internet connection and try again");
            inifiniteLoader.hide();
        }
    });
}