function initManageAuctions() {
    flog("initManageAuctions");

    initTimeAgo();
    // initAuctionFilter();
    initModalForm();
    initDateTimePicker();
    initAuctionDelete();
    initAuctionTable();
    handlePageDateRangePicker();
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
    var modal = $("#addAuctionModal");
    var form = modal.find(" form");

    form.forms({
        callback: function (resp) {
            flog("done", resp);
            modal.modal('hide');
            Msg.success(form.find('[name=auctionTitle]').val() + ' is created!');
            reloadAuctionTable();
        }
    });

    modal.on('show.bs.modal', function () {
        initDateTimePicker()
    });

    modal.on('hidden.bs.modal', function () {
        destroyDateTimePicker()
    });
}

function destroyDateTimePicker() {
    $('#auctionStartDate').data("DateTimePicker").destroy();
    $('#auctionEndDate').data("DateTimePicker").destroy();
}

function initDateTimePicker() {
    var opts = {
        format: "DD/MM/YYYY HH:mm",
        minDate: moment().tz(window.KademiTimeZone),
        timeZone: window.KademiTimeZone
    };
    $('#auctionStartDate').datetimepicker(opts).on('dp.change', function (e) {
        setTimeout(function () {
            var d = $('#auctionStartDate').data("DateTimePicker").date();
            var c = moment(d).add(1, 'h');
            $('#auctionEndDate').data("DateTimePicker").minDate(d).date(c);
        },0)
    });
    $('#auctionEndDate').datetimepicker(opts);
}

function initAuctionDelete() {
    $(document).on('click', '#auction-wrapper .XAuction', function (e) {
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

function reloadAuctionTable() {
    var href = window.location.pathname + window.location.search;
    $('#auctionTableWrapper').reloadFragment({
        url: href,
        whenComplete: function () {
            $('abbr.timeago').timeago();
            initAuctionTable();
        }
    });
}

function handlePageDateRangePicker() {
    $(document.body).on('pageDateChanged', function (e, startDate, endDate) {
        reloadAuctionTable();
    })
}