(function ($) {
    function initDoSearch() {
        var searchForm = $('#searchForm');
        var tbody = $('#results-table');
        var paginator = $('#paginator');

        searchForm.on('submit', function (e) {
            e.preventDefault();
            e.stopPropagation();

            var formParams = searchForm.serialize();

            window.history.pushState(null, null, window.location.pathname + "?" + formParams);

            tbody.reloadFragment({
                url: window.location.pathname + "?" + formParams,
                whenComplete: function () {
                    paginator.find('li a').each(function (i, item) {
                        var link = $(item);
                        var href = link.attr('href');
                        href = href + '&' + formParams;
                        link.attr('href', href);
                    });
                }
            });
        });

        var formParams = searchForm.serialize();
        $('#paginator').find('li a').each(function (i, item) {
            var link = $(item);
            var href = link.attr('href');
            href = href + '&' + formParams;
            link.attr('href', href);
        });
    }

    function initAddToGroup() {
        var searchForm = $('#searchForm');
        var modal = $('#modal-add-to-group');
        var modalForm = modal.find('form');

        modalForm.forms({
            onSuccess: function (resp) {
                Msg.success(resp.messages);
                modal.modal('hide');
            }
        });

        searchForm.find('input, select').on('change', function (e) {
            var inp = $(this);
            var val = inp.val();
            var name = inp.attr('name');

            modalForm.find('[name=' + name + ']').val(val);
        });

        searchForm.find('input, select').each(function () {
            var inp = $(this);
            var val = inp.val();
            var name = inp.attr('name');

            modalForm.find('[name=' + name + ']').val(val);
        });
    }

    function initRemoveFromGroup() {
        var searchForm = $('#searchForm');
        var modal = $('#modal-remove-from-group');
        var modalForm = modal.find('form');

        modalForm.forms({
            onSuccess: function (resp) {
                Msg.success(resp.messages);
                modal.modal('hide');
            }
        });

        searchForm.find('input, select').on('change', function (e) {
            var inp = $(this);
            var val = inp.val();
            var name = inp.attr('name');

            modalForm.find('[name=' + name + ']').val(val);
        });

        searchForm.find('input, select').each(function () {
            var inp = $(this);
            var val = inp.val();
            var name = inp.attr('name');

            modalForm.find('[name=' + name + ']').val(val);
        });
    }

    function initCreateTriggerTimers() {
        var modal = $('#modal-create-trigger-timers');
        var modalForm = modal.find('form');

        modalForm.forms({
            onSuccess: function (resp) {
                Msg.success(resp.messages);
                modal.modal('hide');
            }
        });
    }

    // Run init Methods
    $(function () {
        initDoSearch();
        initAddToGroup();
        initRemoveFromGroup();
        initCreateTriggerTimers();
    });
})(jQuery);