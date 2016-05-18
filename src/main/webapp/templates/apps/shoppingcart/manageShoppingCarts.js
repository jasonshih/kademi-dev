var searchFulfillment = null;
var startDate = null;
var endDate = null;

function initManageShoppingCarts() {
    initHistorySearch();
    initButtons();
    $("abbr.timeago").timeago();
}

function initButtons() {
    $('body').on('click', '.cartLink', function (e) {
        e.preventDefault();
    });
    $('body').on('click', '.clickable', function (e) {
        var btn = $(this);
        var href = btn.data('href');
        window.location = href;
    });
    $('body').on('change', '.check-all', function (e) {
        var checkedStatus = this.checked;
        $('body').find(':checkbox.cart-check').prop('checked', checkedStatus);
    });
    $('body').on('click', '.deleteCart', function (e) {
        e.preventDefault();
        var listToDelete = [];
        $('body').find(':checkbox.cart-check:checked').each(function () {
            listToDelete.push($(this).data("carthref"));
        });
        if (listToDelete.length > 0 && confirm("Are you sure you want to delete " + listToDelete.length + " shopping carts?")) {
            $('body').find('.check-all').check(false).change();
            flog(listToDelete.join(','));
            deleteCarts(listToDelete);
        }
    });
    $('body').on('click', '.markFulfilled', function (e) {
        e.preventDefault();
        var listToFulfill = [];
        $('body').find(':checkbox.cart-check:checked').each(function () {
            var href = $(this).data("cartid");
            listToFulfill.push(href);
        });
        if (listToFulfill.length > 0 && confirm("Are you sure you want to mark " + listToFulfill.length + " shopping carts as fulfilled?")) {
            $('body').find('.check-all').check(false).change();
            flog(listToFulfill.join(','));
            markFulfilled(listToFulfill.join(','));
        }
    });
    $('body').on('change', '.searchGroup', function (e) {
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
    var reportRange = $('#report-range');
    reportRange.exist(function () {
        flog("init report range");
        reportRange.daterangepicker({
            format: 'DD/MM/YYYY', // YYYY-MM-DD
            ranges: {
                'Last 7 Days': [moment().subtract('days', 6), moment()],
                'Last 30 Days': [moment().subtract('days', 29), moment()],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')],
                'This Year': [moment().startOf('year'), moment()],
            },
        },
                function (start, end) {
                    flog('onChange', start, end);
                    startDate = start;
                    endDate = end;
                    doSearch()
                }
        );
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
    if (searchFulfillment !== null && searchFulfillment !== "") {
        href = href + "fulfillment=" + searchFulfillment;
    }
    if (startDate !== null && startDate !== "") {
        href = href + "&startDate=" + formatDate(startDate);
    }
    if (endDate !== null && endDate !== "") {
        href = href + "&finishDate=" + formatDate(endDate);
    }
    $("#cartCSV").attr("href", "carts.csv" + href);
    history.pushState(null, null, window.location.pathname + href);
    doHistorySearch(startDate, endDate, searchFulfillment);
}