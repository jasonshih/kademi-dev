(function () {
    function initShowBy() {
        flog('initShowBy');

        var showByItems = $('.dropdown-show-by li');
        showByItems.each(function () {
            var showByItem = $(this);

            showByItem.on('click', function (e) {
                e.preventDefault();

                showByItems.removeClass('active');
                showByItem.addClass('active');

                var a = showByItem.find('a');
                var showBy = a.attr('href').replace('#', '');

                $('#products-list').attr('class', 'row show-by-' + showBy);
                initProductListTitleAndContent();

                $.cookie('show-by', showBy, {
                    path: '/',
                    expires: 999
                });
            });
        });
    }

    function initSortBy() {
        flog('initSortBy');

        var sortByItems = $('.dropdown-sort-by li');
        sortByItems.each(function () {
            var sortByItem = $(this);

            sortByItem.on('click', function (e) {
                e.preventDefault();

                if (!sortByItem.hasClass('active')) {

                    var a = sortByItem.find('a');
                    var href = a.attr('href');
                    var newUrl = window.location.pathname + href;

                    $.ajax({
                        type: 'GET',
                        url: newUrl,
                        success: function (data) {
                            flog('Success on sorting', data);

                            var fragment = $(data).find('#products-list');
                            var products = fragment.find('.product-item');

                            if (products.length > 0) {
                                $('#products-list').html(products);
                                initProductListTitleAndContent();
                                startFrom = DEFAULT_START_FROM;
                            }

                            sortByItems.removeClass('active');
                            sortByItem.addClass('active');

                            window.history.pushState('', document.title, newUrl);
                        },
                        error: function (resp) {
                            flog('Error when sorting', resp);
                            Msg.error('An error occured doing the product sort. Please check your internet connection and try again');
                        }
                    });
                }
            });
        });
    }

    function initInfinitiveScroll() {
        flog('initInfinitiveScroll');

        if ($('#products-list').find('.product-item').length < startFrom) {
            flog('No more product!');
        } else {
            flog('Init infinitive scroll');
            var win = $(window);
            win.on('scroll', function () {
                if (win.scrollTop() == $(document).height() - win.height()) {
                    doPaginate();
                }
            });
        }
    }

    function doPaginate() {
        var infinitiveLoader = $('#infinitive-loader');
        var newUrl = window.location.pathname + '?q=&fromRange=' + startFrom;
        var sortBy = $('.dropdown-sort-by').find('li.active a').attr('href') || '';
        sortBy = sortBy.replace('?', '&');
        newUrl += sortBy;

        infinitiveLoader.show();

        $.ajax({
            type: 'GET',
            url: newUrl,
            success: function (data) {
                flog('Success on getting more products', data);

                var fragment = $(data).find('#products-list');
                var products = fragment.find('.product-item');

                if (products.length > 0) {
                    $('#products-list').append(products);
                    initProductListTitleAndContent();
                    startFrom += DEFAULT_START_FROM;
                }

                infinitiveLoader.hide();
            },
            error: function (resp) {
                flog('Error when getting more products', resp);

                Msg.error('An error occured doing the product search. Please check your internet connection and try again');
                infinitiveLoader.hide();
            }
        });
    }

    var initEcomCategoryPage = function () {
        initInfinitiveScroll();
        initSortBy();
        initShowBy();
    };

    initEcomCategoryPage();
})(jQuery);





