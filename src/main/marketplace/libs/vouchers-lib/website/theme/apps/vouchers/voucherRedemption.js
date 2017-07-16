/**
 * Created by Anh on 04/04/2017.
 */
$(function () {
    initSearchVoucher();
    var table = $("#vouchers-table");

    var redeemVoucherModal = $("#redeemVoucherModal");
    redeemVoucherModal.find("form").forms({
        onSuccess: function () {
            Msg.info("Redeemed ok");
            redeemVoucherModal.modal('hide');
            reloadVouchers();
        }
    });
    table.on("click", ".voucher-redeem", function (e) {
        e.preventDefault();
        var href = $(e.target).closest("a").attr("href");
        redeemVoucherModal.find("form").attr("action", href);
        redeemVoucherModal.modal();
    });

    var pendingVoucherModal = $("#pendingVoucherModal");
    pendingVoucherModal.find("form").forms({
        onSuccess: function () {
            Msg.info("Set pending ok");
            pendingVoucherModal.modal('hide');
            reloadVouchers();
        }
    });
    table.on("click", ".voucher-pending", function (e) {
        e.preventDefault();
        var href = $(e.target).closest("a").attr("href");
        pendingVoucherModal.find("form").attr("action", href);
        pendingVoucherModal.modal();
    });

    $("#voucher-query-container .glyphicon-remove").parent().click(function (e) {
        e.preventDefault();
        $("#voucher-query").val("");
        doSearch();
    });

    $('.panel-voucherRedemption .chk-all').exist(function () {
        this.each(function () {
            var chkAll = $(this);
            var table = chkAll.parents('table');
            flog("table", table);
            chkAll.on('click', function () {
                flog("clci", chks);
                var chks = table.find('tbody input:checkbox');
                chks.prop('checked', chkAll.is(':checked'));
            });
        });
    });
    $('abbr.timeago').timeago();
});
function initSearchVoucher() {
    $("#voucher-query").keyup(function () {
        typewatch(function () {
            flog("do search");
            doSearch();
        }, 500);
    });
}
function doSearch() {
    var query = $("#voucher-query").val();
    flog("doSearch", query);
    var uri = URI(window.location);
    if (query){
        uri.setSearch('voucher-query', query);
    } else {
        uri.removeSearch('voucher-query');
    }
    flog('New uri', uri.toString());
    history.pushState(null, null, uri.toString());
    reloadVouchers();
}
function reloadVouchers() {
    $("#vouchers-table-body").reloadFragment({
        url: window.location.href,
        whenComplete: function () {
            $('abbr.timeago').timeago();
        }
    });
}