/**
 * Created by Anh on 04/04/2017.
 */
$(function () {
    $('abbr.timeago').timeago();


    var redeemModal = $("#redeemVoucherPageModal");
    redeemModal.find("#redeemVoucherPageForm").forms({
        onSuccess: function (e) {
            Msg.info("Redeemed ok");
            $("#voucherContent").reloadFragment({
                whenComplete: function () {
                    $('abbr.timeago').timeago();
                }
            });
            redeemModal.modal('hide');
        }
    });

    var allocateVoucherModal = $("#allocateVoucherModal");
    allocateVoucherModal.find("form").forms({
        onSuccess: function (e) {
            Msg.info("Allocated ok");
            $("#voucherContent").reloadFragment({
                whenComplete: function () {
                    $('abbr.timeago').timeago();
                }
            });
            allocateVoucherModal.modal('hide');
        }
    });

    var changeStatusModal = $("#changeStatusModal");
    changeStatusModal.find("form").forms({
        onSuccess: function (e) {
            Msg.info("Changed ok");
            $("#voucherContent").reloadFragment({
                whenComplete: function () {
                    $('abbr.timeago').timeago();
                }
            });
            changeStatusModal.modal('hide');
        }
    });

});