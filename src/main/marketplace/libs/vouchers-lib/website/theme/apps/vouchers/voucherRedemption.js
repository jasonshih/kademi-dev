/**
 * Created by Anh on 04/04/2017.
 */
$(function () {
    initSearchVoucher();
    var table = $("#vouchers-table");
    var redeemVoucherModal = $("#redeemVoucherModal");

    function getSelectedVouchers(table) {
        var checks = table.find('tbody input:checked');
        var ids = [];
        checks.each(function (i) {
            ids.push($(this).val());
        });
        return ids;
    }

    $("#redeemVoucherModalBtn").click(function () {
        $("#voucher-ids").val();
        var ids = getSelectedVouchers(table);
        flog("Ids: ", ids);
        if (ids.length > 0) {
            $(".voucher-ids").val(ids);
            redeemVoucherModal.modal("show");
        } else {
            Msg.error("Please select at least one voucher to redeem.");
        }
    });

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
    $("#pendingVoucherModalBtn").click(function () {
        $("#voucher-ids").val();
        var ids = getSelectedVouchers(table);
        flog("Ids: ", ids);
        if (ids.length > 0) {
            $(".voucher-ids").val(ids);
            pendingVoucherModal.modal("show");
        } else {
            Msg.error("Please select at least one voucher to change the status.");
        }
    });

    pendingVoucherModal.find("form").forms({
        onSuccess: function () {
            Msg.info("Status changed ok");
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
    if (query) {
        uri.setSearch('voucher-query', query);
    } else {
        uri.removeSearch('voucher-query');
    }
    flog('New uri', uri.toString());
    history.pushState(null, null, uri.toString());
    reloadVouchers();
}

function reloadVouchers() {
    flog("reloadVouchers");
    $("#vouchers-table-body").reloadFragment({
        url: window.location.href,
        whenComplete: function () {
            $('abbr.timeago').timeago();
        }
    });
}