(function ($) {
    // Modify Expiry/Renewal Date
    function initEditDates() {
        var modal = $('#modal-learning-editDate');
        var form = modal.find('form');

        $('body').on('click', '.btn-ms-editExpiry', function (e) {
            e.preventDefault();

            var btn = $(this);
            var row = btn.closest('tr');
            var moduleStatusId = row.data('modulestatusid');

            var oldDate = btn.data('date');

            modal.find('[name=moduleStatusId]').val(moduleStatusId);
            modal.find('[name=updateField]').val('expiryDate');
            modal.find('[name=newValue]').val(oldDate);

            modal.modal('show');
        });

        $('body').on('click', '.btn-ms-editRenewal', function (e) {
            e.preventDefault();

            var btn = $(this);
            var row = btn.closest('tr');
            var moduleStatusId = row.data('modulestatusid');

            var oldDate = btn.data('date');

            modal.find('[name=moduleStatusId]').val(moduleStatusId);
            modal.find('[name=updateField]').val('renewalDate');
            modal.find('[name=newValue]').val(oldDate);

            modal.modal('show');
        });

        // Init modal form
        form.forms({
            onSuccess: function (resp) {
                Msg.success(resp.messages);

                modal.modal('hide');

                window.location.reload();
            }
        });
    }

    var searchData = {
        q: null,
        startDate: null,
        endDate: null
    };

    function initDoSearch() {
        $('body').on('change', '#training-query', function (e) {
            e.preventDefault();

            searchData.q = this.value;

            var uri = URI(location.pathname + location.search);
            uri.setSearch('q', this.value);

            window.history.pushState(searchData, null, uri.toString());

            doSearch();
        });

        $('body').on('pageDateChanged', function (e, startDate, endDate) {
            searchData.startDate = startDate;
            searchData.endDate = endDate;

            var uri = URI(location.pathname + location.search);
            uri.setSearch('startDate', startDate);
            uri.setSearch('endDate', endDate);

            window.history.pushState(searchData, null, uri.toString());

            doSearch();
        });
    }

    function doSearch() {
        var csv = $('.btn-training-csv');
        csv.attr('href', csv.attr('download') + location.search);

        $('#training-results-table').reloadFragment({
            url: URI(location.pathname + location.search).toString()
        });
    }

    // Run init Methods
    $(function () {
        initEditDates();
        initDoSearch();
    });
})(jQuery);