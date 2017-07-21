var options = {
    startDate: null,
    endDate: null
};

function initAuditItems(canUndoCount) {
    initRestoreAudit();
    initUndo(canUndoCount);
    initRestorePoint();
    
    $(document.body).on('pageDateChanged', function (e, startDate, endDate) {
        options.startDate = startDate;
        options.endDate = endDate;
        doSearch();
    });
}

function initRestoreAudit() {
    $('body').on('click', '.btn-restore-audit', function (e) {
        e.preventDefault();
        
        var btn = $(this);
        var auditId = btn.data('aid');
        var title = btn.data('title');
        
        Kalert.confirm('Are you sure you want to restore ' + title + '?', function () {
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
        });
    });
}

function doSearch() {
    $('#audit-items-table').reloadFragment({
        url: window.location.pathname + '?' + $.param(options)
    });
}

function initUndo(canUndoCount) {
    var totalCount = canUndoCount;
    $('body').on('click', '.btn-undo', function (e) {
        e.preventDefault();
        
        var tbody = $('#audit-items-table tbody');
        flog('totalCount', totalCount);
        if (options.startDate === null || options.endDate === null) {
            Msg.info('Please select a date range to undo');
        } else if (totalCount < 1) {
            Msg.info('There are no records to undo');
        } else {
            var sd = moment(options.startDate);
            var ed = moment(options.endDate);
            Kalert.confirm('Are you sure you want to undo from "' + sd.format("DD/MM/YYYY HH:mm") + '" to "' + ed.format("DD/MM/YYYY HH:mm") + '" with a total of ' + totalCount + ' records?', function () {
                flog(options);
                $.ajax({
                    type: "POST",
                    data: {
                        startDate: options.startDate,
                        endDate: options.endDate,
                        undoAuditItems: true
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
            });
        }
    });
}

function initRestorePoint() {
    $('body').on('click', '.btn-crt-rstp', function (e) {
        e.preventDefault();
        
        $.ajax({
            type: "POST",
            data: {
                createRestorePoint: true
            },
            url: window.location.pathname,
            dataType: "json",
            success: function (result) {
                if (result.status) {
                    Msg.success(result.messages);
                    $('#restore-points-table').reloadFragment();
                } else {
                    Msg.warning(result.messages);
                }
            }
        });
    });
    
    $('body').on('click', '.btn-revert-rstp', function (e) {
        e.preventDefault();
        
        var btn = $(this);
        var date = btn.data('rpd');
        var rpid = btn.data('rpid');
        
        Kalert.confirm('Are you sure you want to revert all changes after ' + date + '?', function () {
            $.ajax({
                type: "POST",
                data: {
                    restorePoint: rpid
                },
                url: window.location.pathname,
                dataType: "json",
                success: function (result) {
                    if (result.status) {
                        Msg.success(result.messages);
                        $('#restore-points-table').reloadFragment();
                        doSearch();
                    } else {
                        Msg.warning(result.messages);
                    }
                }
            });
        });
    });
}