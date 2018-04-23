(function ($) {
    var defaultDealType = 'draft';

    function initNewDeal() {
        var modal = $('#modal-add-deal');
        var form = modal.find('form');

        form.forms({
            onSuccess: function (resp) {
                form.trigger('reset');
                modal.modal('hide');
                Msg.success(resp.messages);
                reloadDeals();
            },
            onError: function (resp) {

            }
        });
    }

    function initDeleteDeals() {
        $('body').on('click', '.del-deal', function (e) {
            e.preventDefault();

            var chks = $('#dealsBody input[name=selectDeal]:checked');
            if (chks.length > 0) {
                Kalert.confirm('Are you sure you want to remove ' + chks.length + ' deal' + (chks.length > 1 ? 's' : '') + '?', function () {
                    $.each(chks, function (i, item) {
                        var ck = $(item);
                        var row = ck.closest('tr');
                        var name = row.data('name');
                        var href = '/travelDeals/' + name + '/';
                        flog('delete', name, href);
                        $.ajax({
                            url: href,
                            data: {
                                deleteDeal: 'true'
                            },
                            type: 'POST',
                            dataType: 'json',
                            success: function (data, textStatus, jqXHR) {
                                row.remove();
                                reloadFilter();
                            }
                        });
                    });

                    $('#selectDeals').attr('checked', false).change();
                });
            }
        });
    }

    function initDuplicateDeals() {
        $('body').on('click', '.duplicate-deal', function (e) {
            e.preventDefault();

            var chks = $('#dealsBody input[name=selectDeal]:checked');
            if (chks.length > 1) {
                Msg.error('Please select only one deal to duplicate.');
            } else if (chks.length === 1) {
                $.each(chks, function (i, item) {
                    var ck = $(item);
                    var row = ck.closest('tr');
                    var name = row.data('name');
                    var href = '/travelDeals/' + name + '/';

                    $.ajax({
                        url: href,
                        data: {
                            duplicateDeal: 'true'
                        },
                        type: 'POST',
                        dataType: 'json',
                        success: function (data, textStatus, jqXHR) {
                            Msg.success('Deal duplicated.');
                            reloadDeals();
                        }
                    });
                });
            }

            $('#selectDeals').attr('checked', false).change();
        });
    }

    function initNewCategory() {
        var modal = $('#addCategoryModal');
        var form = modal.find('form');

        form.forms({
            onSuccess: function (resp) {
                form.trigger('reset');
                modal.modal('hide');
                Msg.success(resp.messages);
                reloadCategories();
            }
        });
    }

    function initDeleteCat() {
        $('body').on('click', '.cat-delete', function (e) {
            e.preventDefault();

            var btn = $(this);
            var row = btn.closest('tr');
            var href = btn.attr('href');
            var title = btn.data('title');

            Kalert.confirm('You want to delete ' + title + '?', function () {
                $.ajax({
                    data: {
                        delCat: href
                    },
                    type: 'POST',
                    dataType: 'json',
                    success: function (data, textStatus, jqXHR) {
                        flog('success', data, textStatus);

                        Msg.success('Category deleted');
                        row.remove();
                    }
                });
            });
        });
    }

    function initNewTag() {
        var modal = $('#modal-travelDeals-addTag');
        var form = modal.find('form');

        form.forms({
            onSuccess: function (resp) {
                form.trigger('reset');
                modal.modal('hide');
                Msg.success(resp.messages);
                reloadTags();
            }
        });
    }

    function initDeleteTag() {
        $('body').on('click', '.btn-travelDeals-tag-del', function (e) {
            e.preventDefault();

            var btn = $(this);
            var row = btn.closest('tr');
            var href = btn.attr('href');
            var title = btn.data('title');

            Kalert.confirm('You want to delete ' + title + '?', function () {
                $.ajax({
                    data: {
                        delTag: href
                    },
                    type: 'POST',
                    dataType: 'json',
                    success: function (data, textStatus, jqXHR) {
                        flog('success', data, textStatus);

                        Msg.success('Tag deleted');
                        row.remove();
                    }
                });
            });
        });
    }

    function initReindex() {
        $('body').on('click', '.reindex', function (e) {
            e.preventDefault();

            Kalert.confirm('Are you sure you want to re-index all the records? This may take several minutes', function () {
                $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        reindex: true
                    },
                    success: function () {
                        window.location.reload();
                    }
                });
            });
        });
    }

    function initSelectDealType() {
        $('body').on('change', 'input[name=travelDeals_dealType]', function (e) {
            e.preventDefault();

            var inp = $(this);
            var val = inp.attr('id').replace('travelDeals_', '');

            updateQueryStringParam('dealType', val);
            reloadDeals();
        });

        window.onpopstate = function (e) {
            var query = URI.parseQuery(location.search);
            var dealType = query.dealType || defaultDealType;

            if (!query.hasOwnProperty('dealType') || query.dealType == null || query.dealType.length < 1) {
                updateQueryStringParam('dealType', defaultDealType, true);
            }

            $('.btn-traveldeals-type-sel').removeClass('active');
            $('#travelDeals_' + dealType).closest('label').addClass('active');

            reloadDeals();
        };
    }

    function reloadDeals() {
        $('#dealsBody').reloadFragment({
            url: location.pathname + location.search
        });

        reloadFilter();
    }

    function reloadFilter() {
        $('#travelDeals-filterBody').reloadFragment({
            url: location.pathname + location.search
        });
    }

    function reloadCategories() {
        $('#travelDeals-categories-body').reloadFragment();
    }

    function reloadTags() {
        $('#travelDeals-tags-body').reloadFragment();
    }

    function updateQueryStringParam(param, value, replace) {
        baseUrl = [location.protocol, '//', location.host, location.pathname].join('');
        urlQueryString = document.location.search;
        var newParam = param + '=' + value,
                params = '?' + newParam;

        // If the "search" string exists, then build params from it
        if (urlQueryString) {
            keyRegex = new RegExp('([\?&])' + param + '[^&]*');
            // If param exists already, update it
            if (urlQueryString.match(keyRegex) !== null) {
                params = urlQueryString.replace(keyRegex, "$1" + newParam);
            } else { // Otherwise, add it to end of query string
                params = urlQueryString + '&' + newParam;
            }
        }
        if (replace) {
            window.history.replaceState({}, "", baseUrl + params);
        } else {
            window.history.pushState({}, "", baseUrl + params);
        }
    }

    $(function () {
        initSelectAll();
        initNewDeal();
        initDeleteDeals();
        initDuplicateDeals();
        initNewCategory();
        initDeleteCat();
        initNewTag();
        initDeleteTag();
        initReindex();
        initSelectDealType();
    });

})(jQuery);