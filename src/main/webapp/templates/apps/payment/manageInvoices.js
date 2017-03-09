function initManageInvoices() {
    flog("initManageWebsites");

    initTimeAgo();
    initInvoiceFilter();
    initModalForm();
    initDateTimePicker();
    initInvoiceDelete();
    initInvoiceTable();
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
    var modal = $("#addWebsiteModal");
    var form = modal.find(" form");

    form.forms({
        callback: function (resp) {
            flog("done", resp);
            modal.modal('hide');
            Msg.success(form.find('[name=invoiceTitle]').val() + ' is created!');
            reloadInvoiceTable();
        }
    });
}

function initDateTimePicker() {
    var date = new Date();
    date.setDate(date.getDate() - 1);
    $('body').css('position','relative');
    var opts = {
        widgetParent: 'body',
        format: "DD/MM/YYYY HH:mm",
        minDate: moment()
    };
    $('#invoiceStartDate').datetimepicker(opts).on('dp.change', function(e){
        var d = $('#invoiceEndDate').data("DateTimePicker").date();
        if (!d || d.isBefore(e.date, 'day')){
            var n = e.date.add(1, 'd');
            $('#invoiceEndDate').data("DateTimePicker").date(n);
        }
    });
    $('#invoiceEndDate').datetimepicker(opts);

    $('#invoiceStartDate, #invoiceEndDate').on('dp.show', function() {
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
        }
    });
}