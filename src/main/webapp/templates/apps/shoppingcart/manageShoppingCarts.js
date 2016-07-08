var searchOptions = {
    searchFulfillment: null,
    startDate: null,
    endDate: null
};

function initManageShoppingCarts() {
    initHistorySearch();
    initButtons();
    $("abbr.timeago").timeago();
}

function initButtons() {
    $(document.body).on('click', '.cartLink', function (e) {
        e.preventDefault();
    });
    $(document.body).on('click', '.clickable', function (e) {
        var btn = $(this);
        var href = btn.data('href');
        window.location = href;
    });
    $(document.body).on('change', '.check-all', function (e) {
        var checkedStatus = this.checked;
        $(document.body).find(':checkbox.cart-check').prop('checked', checkedStatus);
    });
    $(document.body).on('click', '.deleteCart', function (e) {
        e.preventDefault();
        var listToDelete = [];
        $(document.body).find(':checkbox.cart-check:checked').each(function () {
            listToDelete.push($(this).data("carthref"));
        });
        if (listToDelete.length > 0 && confirm("Are you sure you want to delete " + listToDelete.length + " shopping carts?")) {
            $(document.body).find('.check-all').check(false).change();
            flog(listToDelete.join(','));
            deleteCarts(listToDelete);
        }
    });
    $(document.body).on('click', '.markFulfilled', function (e) {
        e.preventDefault();
        var listToFulfill = [];
        $(document.body).find(':checkbox.cart-check:checked').each(function () {
            var href = $(this).data("cartid");
            listToFulfill.push(href);
        });
        if (listToFulfill.length > 0 && confirm("Are you sure you want to mark " + listToFulfill.length + " shopping carts as fulfilled?")) {
            $(document.body).find('.check-all').check(false).change();
            flog(listToFulfill.join(','));
            markFulfilled(listToFulfill.join(','));
        }
    });
    $(document.body).on('change', '.searchGroup', function (e) {
        e.preventDefault();
        var btn = $(this);
        flog(btn.val());
        searchFulfillment = btn.val();
        doSearch()
    });
}

function deleteCarts(listToDelete) {
    for (var i = 0; i < listToDelete.length; i++) {
        deleteFile(listToDelete[i]);
        $("input[data-carthref=\"" + listToDelete[i] + "\"]").closest("tr").remove()
    }
    Msg.info("Successfully deleted " + listToDelete.length + " carts");
}

function markFulfilled(listToFulfill) {
    $.ajax({
        type: "POST",
        url: window.location.pathname,
        data: {
            fulfill: listToFulfill
        },
        success: function (content) {
            flog('response', content);
            doSearch();
        }
    });
}

function initHistorySearch() {
    $(document.body).on('pageDateChanged', function (e, startDate, endDate) {
        searchOptions.startDate = startDate;
        searchOptions.endDate = endDate;

        doSearch();
    });
}

function doHistorySearch(startDate, endDate, searchFulfillment) {
    flog('doHistorySearch', startDate, endDate);
    var data = {
        startDate: formatDate(startDate),
        finishDate: formatDate(endDate),
        fulfillment: searchFulfillment
    };
    flog("data", data);
    var target = $("#shoppingCartList");
    $.ajax({
        type: "GET",
        url: window.location.pathname,
        dataType: 'html',
        data: data,
        success: function (content) {
            flog('response', content);
            var newBody = $(content).find("#shoppingCartList");
            flog("newBody", newBody);
            target.replaceWith(newBody);
            jQuery("abbr.timeago").timeago();
        }
    });
}

function doSearch() {
    var href = "?";
    if (searchOptions.searchFulfillment !== null && searchOptions.searchFulfillment !== "") {
        href = href + "fulfillment=" + searchOptions.searchFulfillment;
    }
    if (searchOptions.startDate !== null && searchOptions.startDate !== "") {
        href = href + "&startDate=" + searchOptions.startDate;
    }
    if (searchOptions.endDate !== null && searchOptions.endDate !== "") {
        href = href + "&finishDate=" + searchOptions.endDate;
    }
    $("#cartCSV").attr("href", "carts.csv" + href);
    history.pushState(null, null, window.location.pathname + href);
    doHistorySearch(searchOptions.startDate, searchOptions.endDate, searchOptions.searchFulfillment);
}
