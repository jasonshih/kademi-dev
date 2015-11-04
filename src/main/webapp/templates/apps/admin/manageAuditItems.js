function initAuditItems(canUndoCount) {
    initRestoreAudit();
    initDateRangeSelector();
    initUndo(canUndoCount);
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

var options = {
    startDate: null,
    endDate: null
};

function initDateRangeSelector() {
    var reportRange = $('#report-range');

    function cb(start, end) {
        options.startDate = start.toISOString();
        options.endDate = end.toISOString();
        doSearch();
    }

    reportRange.exist(function () {
        flog("init report range");
        reportRange.daterangepicker({
            format: 'DD/MM/YYYY HH:mm',
            timePicker: true,
            timePickerIncrement: 5,
            startDate: moment().subtract('days', 6).startOf('day'),
            endDate: moment().endOf('day'),
            ranges: {
                'Today': [
                    moment().startOf('day').toISOString(),
                    moment().endOf('day').toISOString()
                ],
                'Last 7 Days': [
                    moment().subtract(6, 'days').startOf('day').toISOString(),
                    moment().toISOString()
                ],
                'Last 30 Days': [
                    moment().subtract('days', 29).startOf('day').toISOString(),
                    moment().toISOString()],
                'This Month': [
                    moment().startOf('month').startOf('day').toISOString(),
                    moment().endOf('month').toISOString()],
                'Last Month': [
                    moment().subtract('month', 1).startOf('month').startOf('day').toISOString(),
                    moment().subtract('month', 1).endOf('month').toISOString()],
                'This Year': [
                    moment().startOf('year').startOf('day').toISOString(),
                    moment().toISOString()],
            },
        }, cb);
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
            if (confirm('Are you sure you want to undo from "' + sd.format("DD/MM/YYYY HH:mm") + '" to "' + ed.format("DD/MM/YYYY HH:mm") + '" with a total of ' + totalCount + ' records?')) {
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
            }
        }
    });
}