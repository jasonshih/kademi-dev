$(document).ready(function () {
    initPointsBucketTab();
});

function initPointsBucketTab() {
    flog('initPointsBucketTab');

    $('body').on('click', '.reason-codes a', function (e) {
        e.preventDefault();
        var a = $(e.target).closest("a");
        var code = a.attr("href");
        a.closest(".input-group").find("input").val(code);
    });

    $('body').on('click', '.btn-refresh-pb', function (e) {
        e.preventDefault();
        if (confirm('Are you sure you want to refresh the points balance for this bucket?')) {
            var btn = $(this);
            var href = btn.data('href');
            var userid = btn.data('userid');
            var tbody = btn.closest(".tx-container").find("tbody");

            $.ajax({
                url: href,
                type: 'POST',
                dataType: 'JSON',
                data: {
                    updateUserPointsBalance: userid
                },
                success: function (resp, textStatus) {
                    flog('success', resp, textStatus);
                    if (resp.status) {
                        Msg.success(resp.messages);
                        flog("reload tbody", tbody);
                        tbody.reloadFragment({
                            url: window.location.pathname + "?showTab=pointsBucketTab"
                        });
                    } else {
                        Msg.warning(resp.messages);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    flog('error', jqXHR, textStatus, errorThrown);
                    Msg.error(resp.messages);
                }
            });
        }
    });

    $('body').on('click', '.btn-add-points', function (e) {
        e.preventDefault();
        var btn = $(e.target).closest("button");
        var modal = $("#modal-new-points");
        var form = modal.find("form");
        var tbody = btn.closest(".tx-container").find("tbody");
        var id = tbody.attr("id");
        form.data("tbodyid", id);

        var form = modal.find("form");
        if (!form.hasClass("initDone")) {
            form.forms({
                onSuccess: function () {
                    Msg.info("Applied credit. Reloading page..");
                    id = form.data("tbodyid");
                    var tbody = $("#" + id);

                    tbody.reloadFragment({
                        url: window.location.pathname + "?showTab=pointsBucketTab"
                    });
                    modal.modal("hide");
                }
            });
            form.addClass("initDone");
            flog("init form", form);
        } else {
            flog("form init already done");
        }



        var rewardName = btn.data('reward');
        var userid = btn.data('userid');
        modal.find("form").find("input[name=awardToEmail]").val(userid);
        modal.find("form").find("input[name=awardedReward]").val(rewardName);
        modal.modal("show");

    });

    $('body').on('click', '.btn-debit-points', function (e) {
        e.preventDefault();
        var btn = $(e.target).closest("button");
        var modal = $("#modal-debit-points");
        var form = modal.find("form");
        var tbody = btn.closest(".tx-container").find("tbody");
        var id = tbody.attr("id");

        form.data("tbodyid", id);
        if (!form.hasClass("initDone")) {
            form.forms({
                onSuccess: function (resp) {
                    id = form.data("tbodyid");
                    modal.modal("hide");
                    var tbody = $("#" + id);
                    Msg.info("Applied debit. Reloading page.." + tbody.attr("id") );
                    flog("reload tbody", tbody);
                    tbody.reloadFragment({
                        url: window.location.pathname + "?showTab=pointsBucketTab"
                    });
                    modal.modal("hide");
                }
            });
            form.addClass("initDone");
        }

        var rewardName = btn.data('reward');
        var userid = btn.data('userid');
        modal.find("form").find("input[name=email]").val(userid);
        modal.find("form").find("input[name=awardedReward]").val(rewardName);
        flog("set values", modal, rewardName);
        modal.modal("show");
    });
}