function initManageQuotes() {
    flog("initManageWebsites");

    initTimeAgo();
    initQuoteFilter();
    initModalForm();
    initDateTimePicker();
    initQuoteDelete();
    initQuoteTable();
    initAcceptQuote();
}

function initTimeAgo() {
    jQuery.timeago.settings.allowFuture = true;
    $('abbr.timeago').timeago();
}

function initQuoteFilter() {
    $('body').on('change', '.selectState', function (e) {
        e.preventDefault();

        var btn = $(this);
        var val = btn.val();

        flog('select val', val);

        filter_options.state = val;

        reloadQuoteTable();
    });
}

function initModalForm() {
    var modal = $("#addQuoteModal");
    var form = modal.find(" form");

    form.forms({
        onSuccess: function (resp) {
            flog("done", resp);
            modal.modal('hide');
            Msg.success('Quote is created!');
            reloadQuoteTable();
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

    $('#quoteExpiryDate').datetimepicker(opts);

    $('#quoteExpiryDate').on('dp.show', function () {
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

function initAcceptQuote() {
    $('#quote-wrapper').on('click', '.acceptQuote', function (e) {
        e.preventDefault();

        var btn = $(this);
        var href = btn.attr('href');
        var url = window.location.href + "/" + href;

        $.ajax({
            url: url,
            method: 'POST',
            dataType: 'json',
            data: {
                'markAccepted': true
            },
            success: function (data) {
                Msg.success('Quote accepted.');
                reloadQuoteTable();
            }
        });
    });
}

function initQuoteDelete() {
    $('#quote-wrapper').on('click', '.XQuote', function (e) {
        e.preventDefault();
        var href = $(this).attr('href');
        confirmDelete(href, getFileName(href), function () {
            Msg.success('Deleted ' + href);
            reloadQuoteTable();
        });
    });
}

function initQuoteTable() {
    $('#quote-wrapper').DataTable({
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

function reloadQuoteTable() {
    var href = window.location.pathname + '?' + $.param(filter_options);
    $('#quoteTableWrapper').reloadFragment({
        url: href,
        whenComplete: function () {
            $('abbr.timeago').timeago();
            initQuoteTable();
        }
    });
}