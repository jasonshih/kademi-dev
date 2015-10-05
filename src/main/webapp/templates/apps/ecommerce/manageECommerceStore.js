function initManageECommerceStore() {
    initDetailsForm();
    initSearch();
    initShowAll();
    initLibrarySelect();
    initIncludeProduct();
    initSelectAllProducts();
    initEditProductSettings();
    initGroupEditing();
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

function initGroupEditing() {
    $("#modalGroup input[type=checkbox]").click(function () {
        var $chk = $(this);
        flog("checkbox click", $chk, $chk.is(":checked"));
        var isRecip = $chk.is(":checked");
        var groupType = $chk.closest('label').data("grouptype");
        setGroupRecipient($chk.attr("name"), groupType, isRecip);
    });

    $('body').on('click', '.btn-remove-group', function (e) {
        e.preventDefault();
        var btn = $(this);
        var name = btn.attr("href");
        setGroupRecipient(name, "", false);
        btn.closest('span').remove();
        $("#modalGroup input[name=" + name + "]").check(false);
    });
}

function setGroupRecipient(name, groupType, isRecip) {
    flog("setGroupRecipient", name, groupType, isRecip);
    try {
        $.ajax({
            type: 'POST',
            url: window.location.pathname,
            data: {
                group: name,
                isRecip: isRecip
            },
            dataType: "json",
            success: function (data) {
                if (data.status) {
                    flog("saved ok", data);
                    if (isRecip) {
                        var groupClass = "";
                        var groupIcon = "";
                        if (groupType === "P" || groupType === "") {
                            groupClass = "alert alert-success";
                            groupIcon = "clip-users";
                        } else if (groupType === "S") {
                            groupClass = "alert alert-info";
                            groupIcon = "fa fa-trophy";
                        } else if (groupType === "M") {
                            groupClass = "alert alert-info";
                            groupIcon = "fa fa-envelope";
                        }
                        var newBtn = $('<span id="group_' + name + '" class="group-list ' + groupClass + '">'
                                + '<i class="' + groupIcon + '"></i>'
                                + '<span class="block-name" title="' + name + '"> ' + name + '</span>'
                                + ' <a href="' + name + '" class="btn btn-xs btn-danger btn-remove-group" title="Delete access for group ' + name + '"><i class="fa fa-times"></i></a>'
                                + '</span>');
                        $(".GroupList").append(newBtn);
                        flog("appended to", $(".GroupList"));
                    } else {
                        var toRemove = $("#group_" + name);
                        toRemove.remove();
                    }
                } else {
                    flog("error", data);
                    Msg.error("Sorry, couldnt save " + data);
                }
            },
            error: function (resp) {
                flog("error", resp);
                Msg.error("Sorry, couldnt save - " + resp);
            }
        });
    } catch (e) {
        flog("exception in createJob", e);
    }
}