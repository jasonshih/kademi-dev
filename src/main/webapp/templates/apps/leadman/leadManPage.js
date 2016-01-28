(function (w) {

    var searchOptions = {
        team: null,
        query: ''
    };

    function initOrgSelect() {
        $('body').on('click', '.btn-select-org', function (e) {
            e.preventDefault();

            var btn = $(this);
            var b = btn.closest('div').find('.aggr-title');
            b.html(btn.html());

            var href = btn.attr('href');
            if (href === '#') {
                searchOptions.team = null;
            } else {
                searchOptions.team = href;
            }

            doSearch();
        });
    }

    function initSearchField() {
        $('body').on('change', '#leadQuery', function (e) {
            e.preventDefault();

            var inp = $(this);

            searchOptions.query = inp.val();

            doSearch();
        });
    }

    function doSearch() {
        var source = $("#lead-template").html();
        var template = Handlebars.compile(source);
        $.ajax({
            url: window.location.pathname + '?sLead&' + $.param(searchOptions),
            dataType: 'JSON',
            success: function (data, textStatus, jqXHR) {
                var t = template(data.hits);
                $('#leadBody').empty();
                $('#leadBody').html(t);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                flog('error', jqXHR, textStatus, errorThrown);
            }
        });
    }

    w.initLeadManPage = function () {
        initOrgSelect();
        initSearchField();

        Handlebars.registerHelper('NotEmpty', function (conditional, options) {
            if (typeof conditional !== 'undefined' && typeof conditional.length !== 'undefined') {
                if (conditional.length > 0) {
                    return options.fn(this);
                }
            }
            return options.inverse(this);
        });

        Handlebars.registerHelper('formatTime', function (object) {
            var d = new moment(object);
            
            return d.format('MMMM Do YYYY, h:mm:ss a');
        });

        doSearch();
    };
})(this);