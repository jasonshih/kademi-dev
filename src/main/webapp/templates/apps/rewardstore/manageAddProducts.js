(function ($) {
    function initAddProducts() {
        flog("add prods", $('#addProducts'));
        $('#addSelected').click(function (e) {
            e.preventDefault();
            Msg.info('Adding selected', 'manageAddProducts');
            var checks = $("#products-list").find('input:checked');
            var ids = [];
            checks.each(function (count, item) {
                ids.push($(item).data('pid'));
            });

            updateProductSelected(ids.join(','));
        });

        $(".addAllMatched").click(function (e) {
            e.preventDefault();
            Kalert.confirm('This will add all products matching the current criteria to the reward store. Do you want to proceed?', 'Yes', function () {
                $.ajax({
                    url: window.location,
                    type: 'POST',
                    dataType: 'JSON',
                    data: {
                        addAllMatched: true
                    },
                    success: function (data, textStatus, jqXHR) {
                        window.location.reload();
                    },
                    error: function () {
                        Msg.error('Oh No! Something went wrong!', 'manageAddProducts');
                    }
                });
            });

        });
    }

    function initSearchProduct() {
        $("#product-query").keyup(function () {
            typewatch(function () {
                flog("do search");
                doProductSearch();
            }, 500);
        });

        $('body').on('change', '.category', function (e) {
            var t = $(this);

            // Update the search query field
            var query = $("#product-query").val();

            query += ' category:' + t.val();
            query = query.trim();
            $("#product-query").val(query);

            doProductSearch();
        });

        $('body').on('change', '#search-library', function (e) {
            doProductSearch();
        });
    }

    function initSortable() {
        $('body').on('click', '.sort-field', function (e) {
            e.preventDefault();
            var a = $(e.target);
            var uri = URI(window.location);
            var field = a.attr('id');

            var dir = 'asc';
            if (field == getSearchValue(window.location.search, 'sortfield')
                    && 'asc' == getSearchValue(window.location.search, 'sortdir')) {
                dir = 'desc';
            }
            uri.setSearch('sortfield', field);
            uri.setSearch('sortdir', dir);

            window.history.pushState('', '', uri.toString());

            doProductSearch();
        });
    }

    function initChosenSelectors() {
        $(".chosen-select").chosen({
            search_contains: true
        });
    }

    function doProductSearch() {
        flog("doProductSearch");
        var query = $("#product-query").val();
        var orgId = $("#search-library").val();
        flog("doSearch", query, orgId);
        var newUrl = window.location.pathname + "?addProducts&q=" + query + "&l=" + orgId;

        var sortfield = getSearchValue(window.location.search, 'sortfield');
        var sortdir = getSearchValue(window.location.search, 'sortdir');

        if (sortfield && sortdir) {
            newUrl += "&sortfield=" + sortfield + "&sortdir=" + sortdir;
        }

        window.history.replaceState("", "", newUrl);
        $.ajax({
            type: 'GET',
            url: newUrl,
            success: function (data) {
                var fragment = $(data).find("#searchResults");
                $("#searchResults").replaceWith(fragment);
            },
            error: function (resp) {
                Msg.error("An error occured doing the search. Please check your internet connection and try again", 'manageAddProducts');
            }
        });
    }


    function updateProductSelected(productIds) {
        var data = {};
        data['addProductIds'] = productIds;

        $.ajax({
            type: "POST",
            url: window.location.pathname,
            datatype: "json",
            data: data,
            success: function (response) {
                flog("response", response, response.status);
                if (response.status) {
                    Msg.info(response.messages[0], 'manageAddProducts');
                    window.location.reload();
                } else {
                    Msg.error("There was an error changing the product status", 'manageAddProducts');
                }
            },
            error: function (event, XMLHttpRequest, ajaxOptions, thrownError) {
                flog('error saving moduleStatus', event, XMLHttpRequest, ajaxOptions, thrownError);
                Msg.error("There was an error changing the product inclusion status", 'manageAddProducts');
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

    // Run init methods
    $(function () {
        initSearchProduct();
        initAddProducts();
        initSortable();
        initChosenSelectors();
    });
})(jQuery);