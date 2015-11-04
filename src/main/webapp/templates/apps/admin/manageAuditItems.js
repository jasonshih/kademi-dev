function initAuditItems() {
    initRestoreAudit();
}

function initRestoreAudit() {
    $('body').on('click', '.btn-restore-audit', function (e) {
        e.preventDefault();

        var btn = $(this);
        var auditId = btn.data('aid');
        var title = btn.data('title');

        if (confirm('Are you sure you want to restore ' + title + '?')) {
            $.ajax({
                type: "POST",
                data: {
                    restoreAudit: auditId
                },
                url: window.location.pathname,
                dataType: "json",
                success: function (result) {
                    if (result.status) {
                        Msg.success(result.messages);
                        $('#audit-items-table').reloadFragment();
                    } else {
                        Msg.warning(result.messages);
                    }
                }
            });
        }
    });
}