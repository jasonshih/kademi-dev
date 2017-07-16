function initManageECommerceStore() {
    initDetailsForm();
    initSearch();
    initShowAll();
    initLibrarySelect();
    initIncludeProduct();
    initSelectAllProducts();
    initEditProductSettings();
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
}

function initShowAll() {
    $('body').on('change', '.filterType', function (e) {
        var btn = $(this);
        var val = btn.val();

        searchParams.showAll = val;
        doSearch();

    });
}

function initLibrarySelect() {
    $('body').on('change', '#search-library', function (e) {
        e.preventDefault();

        var btn = $(this);
        var orgId = btn.val();

        searchParams.orgId = orgId;

        doSearch();
    });
}

function doSearch() {
    Msg.info("Searching...");
    var url = window.location.pathname + "?" + $.param(searchParams);
    $('#products-list').reloadFragment({
        url: url
    });
}

function initIncludeProduct() {
    $("#table-products").on("change", ".product-toggle", function (e) {
        var target = $(e.target);
        var productName = target.closest("tr").find("a").html();
        var v = target.prop("checked");
        updateProductIncluded(target.data('pid'), productName, v);
    });
}

function initSelectAllProducts() {
    $('body').on('change', '.product-all-toggle', function (e) {
        e.preventDefault();

        var btn = $(this);
        var isChecked = btn.is(':checked');
        var ids = [];
        var allIds = $('.product-toggle');
        allIds.each(function (count, item) {
            ids.push($(item).data('pid'));
        });

        updateProductSelected(ids.join(','), isChecked);
    });
}

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
                var ids = productIds.split(',');
                $.each(ids, function (val) {
                    $('.product-toggle[data-pid=' + val + ']').prop('checked', included);
                });
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