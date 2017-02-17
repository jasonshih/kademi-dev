$(document).ready(function () {
    initPointsBucketTab();
});

function initPointsBucketTab() {
    flog('initPointsBucketTab');

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
        var btn = $(this);
        var modal = $("#modal-new-points");

        var form = modal.find("form");
        if (!form.hasClass("initDone")) {
            form.forms({
                onSuccess: function () {
                    Msg.info("Applied credit. Reloading page..");
                    var tbody = btn.closest(".tx-container").find("tbody");
                    flog("reload tbody", tbody.attr("id"));
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
        modal.find("form").find("input[name=awardToEmail]").val(userid);
        modal.find("form").find("input[name=awardedReward]").val(rewardName);
        modal.modal("show");

    });

    $('body').on('click', '.btn-debit-points', function (e) {
        e.preventDefault();
        var btn = $(this);
        var modal = $("#modal-debit-points");

        flog("show debit", modal);

        var form = modal.find("form");
        if (!form.hasClass("initDone")) {
            form.forms({
                onSuccess: function () {
                    modal.modal("hide");
                    Msg.info("Applied debit. Reloading page..");
                    var tbody = btn.closest(".tx-container").find("tbody");
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