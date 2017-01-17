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
}