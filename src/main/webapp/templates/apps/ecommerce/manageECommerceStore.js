function initManageECommerceStore() {
    initDetailsForm();
    initSearch();
    initEditProductSettings();
    initRemoveSelected();
}

function initDetailsForm() {
    var detailsForm = $('#detailsForm');

    detailsForm.forms({
        onSuccess: function (resp) {
            if (resp.status) {
                Msg.info(resp.messages[0]);
            }
        }
    });
}

var searchParams = {
    orgId: '',
    showAll: false,
    query: ''
};

function initSearch() {
    $("#product-query").keyup(function () {
        typewatch(function () {
            var val = $("#product-query").val();
            searchParams.query = val;
            doSearch();
        }, 500);
    });
    $('body').on('change', '.category', function (e) {
        doSearch();
    });
}

function doSearch() {
    Msg.info("Searching...");

    var query = $("#product-query").val();
    var categoryName = $(".category").val();
    var sortfield = getSearchValue(window.location.search, 'sortfield');
    var sortdir = getSearchValue(window.location.search, 'sortdir');

    var newUrl = window.location.pathname + "?q=" + query + "&categoryName=" + categoryName;
    if (sortfield && sortdir) {
        newUrl += "&sortfield=" + sortfield + "&sortdir=" + sortdir;
    }

    $('#products-list').reloadFragment({
        url: newUrl
    });
}

function getSearchValue(search, key) {
    if (search.charAt(0) == '?') {
        search = search.substr(1);
    }
    parts = search.split('&');
    if (parts) {
        for (var i = 0; i < parts.length; i++) {
            entry = parts[i].split('=');
            if (entry && key == entry[0]) {
                return entry[1];
            }
        }
    }
    return '';
}

function initRemoveSelected() {
    $('body')
            .off('click', '.btn-ecom-remove-selected')
            .on('click', '.btn-ecom-remove-selected', function (e) {
                e.preventDefault();
                var allIds = $('.product-toggle:checked');
                var ids = [];
                allIds.each(function (count, item) {
                    ids.push($(item).data('pid'));
                });

                if (ids.length > 0) {
                    Kalert.confirm("You want to remove " + ids.length + " products from the store?", function () {
                        updateProductSelected(ids.join(','), false);
                    });
                }

            });
}
//function initIncludeProduct() {
//    $("#table-products").on("change", ".product-toggle", function (e) {
//        var target = $(e.target);
//        var productName = target.closest("tr").find("a").html();
//        var v = target.prop("checked");
//        updateProductIncluded(target.data('pid'), productName, v);
//    });
//}
//
//function initSelectAllProducts() {
//    $('body').on('change', '.product-all-toggle', function (e) {
//        e.preventDefault();
//
//        var btn = $(this);
//        var isChecked = btn.is(':checked');
//        var ids = [];
//        var allIds = $('.product-toggle');
//        allIds.each(function (count, item) {
//            ids.push($(item).data('pid'));
//        });
//
//        updateProductSelected(ids.join(','), isChecked);
//    });
//}

function initEditProductSettings() {
    var productInStoreModal = $("#editProductInStoreModal");
    $("body").on("click", ".product-instore-details", function (e) {
        e.preventDefault();
        var target = $(e.target).closest("a");
        loadProductInReward(target.prop("href"), productInStoreModal);
    });
    productInStoreModal.find("form").forms({
        onSuccess: function () {
            Msg.info("Saved");
            productInStoreModal.modal("hide");
        }
    });
}

function loadProductInReward(href, productInRewardModal) {
    $.ajax({
        type: 'GET',
        url: href,
        success: function (data) {
            flog("success", data);
            var $fragment = $(data).find("#product-in-store-fields");
            flog("frag", $fragment);
            var form = productInRewardModal.find("form");
            form.find('.form-content').html($fragment);
            form.attr("action", href);
            productInRewardModal.modal("show");
        },
        error: function (resp) {
            Msg.error("An error occured doing the user search. Please check your internet connection and try again");
        }
    });
}

function updateProductIncluded(productId, productName, included) {
    $.ajax({
        type: "POST",
        url: window.location.pathname,
        dataType: "json",
        cache: false,
        data: {
            productId: productId,
            included: included
        },
        success: function (response) {
            flog("response", response, response.status);
            if (response.status) {
                if (included) {
                    Msg.info("Added " + productName);
                    $("#product-" + productId).addClass("in-store-true");
                } else {
                    Msg.info("Removed " + productName);
                    $("#product-" + productId).removeClass("in-store-true");
                }
            } else {
                Msg.error("There was an error changing the product inclusion status");
            }
        },
        error: function (event, XMLHttpRequest, ajaxOptions, thrownError) {
            flog('error saving moduleStatus', event, XMLHttpRequest, ajaxOptions, thrownError);
            Msg.error("There was an error changing the product inclusion status");
        }
    });
}

function updateProductSelected(productIds, included) {
    var data = {};
    if (included) {
        data['addProductIds'] = productIds;
    } else {
        data['removeProductIds'] = productIds;
    }
    $.ajax({
        type: "POST",
        url: window.location.pathname,
        dataType: "json",
        data: data,
        success: function (response) {
            flog("response", response, response.status);
            if (response.status) {
                Msg.info(response.messages[0]);
                doSearch();
            } else {
                Msg.error("There was an error changing the product status");
            }
        },
        error: function (event, XMLHttpRequest, ajaxOptions, thrownError) {
            flog('error saving moduleStatus', event, XMLHttpRequest, ajaxOptions, thrownError);
            Msg.error("There was an error changing the product inclusion status");
        }
    });
}