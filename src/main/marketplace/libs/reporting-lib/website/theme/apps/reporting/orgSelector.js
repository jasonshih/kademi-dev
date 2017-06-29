$(function () {
    function initOrgSelector() {
        flog("initOrgSelector");
        $('.orgSelectorWrap').on('click', 'a', function (e) {
            e.preventDefault();

            var orgId = $(this).attr('data-orgId');
            var orgTitle;
            if (orgId) {
                orgTitle = $(this).text();
                $.cookie('selectedOrg', orgId, {expires: 360, path: '/'});
            } else {
                $.cookie('selectedOrg', "", {expires: 360, path: '/'});
                orgTitle = "";
            }
            $(e.target).closest(".org-selector").find(".selectOrgSearch").val(orgTitle);
            window.location.reload();
        });

        var dropdownMenuOrgSelector = $('#dropdownMenuOrgSelector');

        $('.orgSelectorWrap').on('click', '.btn-select-org-selector', function (e) {
            if (!dropdownMenuOrgSelector.data('loaded')) {
                dropdownMenuOrgSelector.data('loaded', true);

                dropdownMenuOrgSelector.reloadFragment({
                    url: window.location.pathname + (window.location.search || '?') + '&loadOrgSelector'
                });
            }
        });
    }


    function initOrgSelectorSearch() {
        var orgSearch = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            remote: {
                url: '/queries/?searchOrgs=%QUERY',
                wildcard: '%QUERY'
            }
        });

        $('.selectOrgSearch').typeahead({
            highlight: true
        }, {
            display: 'title',
            limit: 10,
            source: orgSearch,
            templates: {
                empty: [
                    '<div class="empty-message">',
                    'No existing stores were found.',
                    '</div>'
                ].join('\n'),
                suggestion: Handlebars.compile(
                        '<div>'
                        + '<strong>{{title}}</strong>'
                        + '</div>')
            }
        });

        $('.selectOrgSearch').bind('typeahead:select', function (ev, sug) {
            $.cookie('selectedOrg', sug.orgId, {expires: 360, path: '/'});
            window.location.reload();
        });
    }

    initOrgSelector();
    initOrgSelectorSearch();
});