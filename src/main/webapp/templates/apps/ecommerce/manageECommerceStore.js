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
        callback: function (resp) {
            if (resp.status) {
                Msg.info(resp.messages.first());
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
    $("#all-products-toggle").change(function () {
        var btn = $(this);
        var checked = btn.prop("checked");

        searchParams.showAll = checked;

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
    $('body').on('click', '.product-instore-details', function (e) {
        e.preventDefault();
        
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
                    $("#product-" + productId).addClass("in-reward-true");
                } else {
                    Msg.info("Removed " + productName);
                    $("#product-" + productId).removeClass("in-reward-true");
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
                Msg.info(response.messages.first());
                var ids = productIds.split(',');
                ids.each(function (val) {
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