function initManageInvoices() {
    flog("initManageWebsites");

    initTimeAgo();
    initInvoiceFilter();
    initModalForm();
    initDateTimePicker();
    initInvoiceDelete();
    initInvoiceTable();
    initMarkAsSentInvoice();
}

function initTimeAgo() {
    jQuery.timeago.settings.allowFuture = true;
    $('abbr.timeago').timeago();
}

function initInvoiceFilter() {
    $('body').on('change', '.selectState', function (e) {
        e.preventDefault();

        var btn = $(this);
        var val = btn.val();

        flog('select val', val);

        filter_options.state = val;

        reloadInvoiceTable();
    });
}

function initModalForm() {
    var modal = $("#addInvoiceModal");
    var form = modal.find(" form");

    form.forms({
        onSuccess: function (resp) {
            flog("done", resp);
            modal.modal('hide');
            Msg.success('Invoice is created!');
            reloadInvoiceTable();
        }
    });
}

function initDateTimePicker() {
    var date = new Date();
    date.setDate(date.getDate() - 1);
    $('body').css('position', 'relative');
    var opts = {
        widgetParent: 'body',
        format: "DD/MM/YYYY HH:mm",
        minDate: moment()
    };

    $('#invoiceDueDate').datetimepicker(opts);

    $('#invoiceDueDate').on('dp.show', function () {
        var datepicker = $('body').find('.bootstrap-datetimepicker-widget:last');
        if (datepicker.hasClass('bottom')) {
            var top = $(this).offset().top - $(this).outerHeight();
            var left = $(this).offset().left;
            datepicker.css({
                'top': top + 'px',
                'bottom': 'auto',
                'left': left + 'px',
                'z-index': 9999
            });
        } else if (datepicker.hasClass('top')) {
            var top = $(this).offset().top - datepicker.outerHeight() - 40;
            var left = $(this).offset().left;
            datepicker.css({
                'top': top + 'px',
                'bottom': 'auto',
                'left': left + 'px',
                'z-index': 9999
            });
        }
    });
}

function initMarkAsSentInvoice() {
    $('#invoice-wrapper').on('click', '.markAsSent', function (e) {
        e.preventDefault();

        var btn = $(this);
        var href = btn.attr('href');
        var url = window.location.href + "/" + href;

        $.ajax({
            url: url,
            method: 'POST',
            dataType: 'json',
            data: {
                'markAsSent': true
            },
            success: function (data) {
                Msg.success('Invoice marked as sent.', "invoiceSent");
                reloadInvoiceTable();
            }
        });
    });
}

function initInvoiceDelete() {
    $('#invoice-wrapper').on('click', '.XInvoice', function (e) {
        e.preventDefault();
        var href = $(this).attr('href');
        confirmDelete(href, getFileName(href), function () {
            Msg.success('Deleted ' + href);
            reloadInvoiceTable();
        });
    });
}

function initInvoiceTable() {
    $('#invoice-wrapper').DataTable({
        searching: false,
        paging: false,
        "order": [[6, 'desc'], [1, 'desc']],
        "columns": [
            {"orderable": false},
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            {"orderable": false}
        ]
    });
}

var filter_options = {
    state: ''
};

function reloadInvoiceTable() {
    var href = window.location.pathname + '?' + $.param(filter_options);
    $('#invoiceTableWrapper').reloadFragment({
        url: href,
        whenComplete: function () {
            $('abbr.timeago').timeago();
            initInvoiceTable();
            initMarkAsSentInvoice();
        }
    });
}