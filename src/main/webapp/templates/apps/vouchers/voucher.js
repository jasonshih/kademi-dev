function doSearch() {
    var newUrl = window.location.pathname + "?q=" + $("#voucher-query").val() + "&status=" + $("#status").val() + "&voucherType=" + $("#voucherType").val();
    flog("New URL ", newUrl);
    $.ajax({
        type: 'GET',
        url: newUrl,
        success: function (data) {
            flog("success", data);
            window.history.pushState("", document.title, newUrl);
            var $fragment = $(data).find("#searchResults");
            flog("replace", $("#se"));
            flog("frag", $fragment);
            $("#searchResults").replaceWith($fragment);
        },
        error: function (resp) {
            Msg.error("err");
        }
    });
}

function initSearchVoucher() {
    $("#voucher-query").on({
        keyup: function () {
            typewatch(function () {
                flog("initSearchVoucher: do search");
                doSearch();
            }, 500);
        },
        change: function () {
            flog("voucherType changed");
            flog("do search");
            doSearch();
        }
    });
    $("#status").change(function () {
        flog("status changed");
        doSearch();
    });
    $("#voucherType").change(function () {
        flog("voucherType changed");
        doSearch();
    });
}

function initDeleteVouchers() {
    $('body').on('click', '.btn-remove-vouchers', function (e) {
        e.preventDefault();
        var vouchers = $('#vouchers-table-body input[type=checkbox]:checked');
        var voucherIds = [];

        vouchers.each(function (i, item) {
            var v = $(item);
            voucherIds.push(v.data('vid'));
        });

        if (voucherIds.length > 0 && confirm('Are you sure you want to delete ' + voucherIds.length + ' vouchers?')) {
            $.ajax({
                url: window.location.pathname,
                type: 'POST',
                dataType: 'json',
                data: {
                    deleteVouchers: voucherIds.join(',')
                },
                success: function (data, textStatus, jqXHR) {
                    if (data.status) {
                        Msg.success(data.messages);
                        reloadVouchers();
                    } else {
                        Msg.warning(data.messages);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {

                }
            });
        }
    });
}


/*
 TODO: make this work! 
 
 function initSort() {
 flog('initSort()');
 $('.sort-field').on('click', function (e) {
 e.preventDefault();
 var a = $(e.target);
 var search = window.location.search;
 flog(search);
 var field = a.attr('id');
 var dir = 'asc';
 if (field == getSearchValue(search, 'sortfield')) {
 if (getSearchValue(search, 'sortdir') == 'asc') {
 dir = 'desc';
 } else {
 dir = 'asc'
 }
 }
 doSearchAndSort(field, dir);
 });
 }
 
 function doSearchAndSort(field, direction) {
 var newUrl = window.location.pathname + "?q=" + $("#org-query").val() + "&searchOrgType=" + $("#searchOrgType").val() + "&sortfield=" + field + "&sortdir=" + direction;
 $.ajax({
 type: 'GET',
 url: newUrl,
 success: function (data) {
 flog("success", data);
 window.history.pushState("", document.title, newUrl);
 var $fragment = $(data).find("#searchResults");
 flog("replace", $("#se"));
 flog("frag", $fragment);
 $("#searchResults").replaceWith($fragment);
 },
 error: function (resp) {
 Msg.error("err");
 }
 });
 }
 */