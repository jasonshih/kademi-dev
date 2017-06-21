function initManageAuctions() {
    flog("initManageWebsites");

    initTimeAgo();
    initAuctionFilter();
    initModalForm();
    initDateTimePicker();
    initAuctionDelete();
    initAuctionTable();
}

function initTimeAgo() {
    jQuery.timeago.settings.allowFuture = true;
    $('abbr.timeago').timeago();
}

function initAuctionFilter() {
    $('body').on('change', '.selectState', function (e) {
        e.preventDefault();

        var btn = $(this);
        var val = btn.val();

        flog('select val', val);

        filter_options.state = val;

        reloadAuctionTable();
    });
}

function initModalForm() {
    var modal = $("#addWebsiteModal");
    var form = modal.find(" form");

    form.forms({
        callback: function (resp) {
            flog("done", resp);
            modal.modal('hide');
            Msg.success(form.find('[name=auctionTitle]').val() + ' is created!');
            reloadAuctionTable();
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
    $('#auctionStartDate').datetimepicker(opts).on('dp.change', function(e){
        var d = $('#auctionEndDate').data("DateTimePicker").date();
        if (!d || d.isBefore(e.date, 'day')){
            var n = e.date.add(1, 'd');
            $('#auctionEndDate').data("DateTimePicker").date(n);
        }
    });
    $('#auctionEndDate').datetimepicker(opts);

    $('#auctionStartDate, #auctionEndDate').on('dp.show', function() {
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

function initAuctionDelete() {
    $('#auction-wrapper').on('click', '.XAuction', function (e) {
        e.preventDefault();
        var href = $(this).attr('href');
        confirmDelete(href, getFileName(href), function () {
            Msg.success('Deleted ' + href);
            reloadAuctionTable();
        });
    });
}

function initAuctionTable() {
    $('#auction-wrapper').DataTable({
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

function reloadAuctionTable() {
    var href = window.location.pathname + '?' + $.param(filter_options);
    $('#auctionTableWrapper').reloadFragment({
        url: href,
        whenComplete: function () {
            $('abbr.timeago').timeago();
            initAuctionTable();
            initAuctionDelete();
        }
    });
};

$(document.body).on('pageDateChanged', function (e, startDate, endDate, text, trigger, initial) {
    if (initial) {
        flog("Ignore initial");
        return;
    }
    reloadAuctionTable();

});