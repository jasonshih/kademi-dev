$(function () {
    initSort();

    $(".check-all").on('change', function (e) {
        var checkedStatus = this.checked;
        flog("check-all ", checkedStatus);
        $("#lead-tbody").find('.lead-check').prop('checked', checkedStatus);
    });

    function deleteLeads(deleteContact) {
        var ids = [];

        $("#lead-tbody").find('.lead-check:checked').each(function (i, item) {
            var id = $(item).val();
            ids.push(id);
        });

        if (ids.length < 1) {
            Msg.info('Please select at least one lead to delete');
        } else {
            Kalert.confirm('Are you sure you want to delete ' + ids.length + ' lead' + (ids.length > 1 ? 's' : '') + '?', 'Delete', function () {
                $.ajax({
                    url: window.location.origin + "/leads",
                    type: 'POST',
                    dataType: 'JSON',
                    data: {
                        deleteLeads: ids,
                        deleteContact: deleteContact
                    },
                    success: function (resp) {
                        Kalert.close();

                        if (resp.status) {
                            Msg.success(resp.messages);
                        } else {
                            Msg.warning(resp.messages);
                        }
                        $("#lead-tbody").reloadFragment();
                    },
                    error: function () {
                        Kalert.close();
                        Msg.error('Oh No! Something went wrong!');
                    }
                });
            });
        }

    }

    $(".btn-remove-leads-contacts").on('click', function (e) {
        deleteLeads(true);
    });

    $(".btn-remove-leads").on('click', function (e) {
        deleteLeads(false);
    });

    function initSort() {
        flog('initSort()');
        $('.sort-field').on('click', function (e) {
            e.preventDefault();
            var a = $(e.target);
            var search = window.location.search;
            flog(search);
            var field = a.attr('id');
            var dir = 'asc';
            if (field == getSearchValue(search, 'sortfield')) {
                if (getSearchValue(search, 'sortdir') == 'asc') {
                    dir = 'desc';
                } else {
                    dir = 'asc'
                }
            }
            doSearchAndSort(field, dir);
        });
    }

    function doSearchAndSort(field, direction) {
        var newUrl = window.location.pathname + "?sortfield=" + field + "&sortdir=" + direction;
        reloadSearchResults(newUrl);
    }

    function reloadSearchResults(newUrl) {
        $("#lead-tbody").reloadFragment({
            url: newUrl,
            whenComplete: function (response) {
                window.history.pushState("", document.title, newUrl);
                Msg.info('Refreshed', 1500)
                flog('complete', response);
            }
        });

    }

    function getSearchValue(search, key) {
        if (search.charAt(0) == '?') {
            search = search.substr(1);
        }
        parts = search.split('&');
        if (parts) {
            for (var i = 0; i < parts.length; i++) {
                entry = parts[i].split('=');
                if (entry && key == entry[0]) {
                    return entry[1];
                }
            }
        }
        return '';
    }

});