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

        var template = Handlebars.compile(
                '{{#if this}}'
                + '{{#each this}}'
                + '<li>\n'
                + '    <a data-orgid="{{orgId}}" href="#"><i class="fa fa-check" style="visibility: hidden"></i> {{formattedName}}</a>'
                + '</li>'
                + '{{/each}}'
                + '{{else}}'
                + '<li><i class="fa fa-check" style="visibility: hidden"></i> No selections available</li>'
                + '{{/if}}'
                );

        var groupName = $('.orgSelectorWrap').data('groupname');
        var dropdownMenuOrgSelector = $('.orgSelectorWrap .dropdownMenuOrgSelector');

        $('.orgSelectorWrap').on('click', '.btn-select-org-selector', function (e) {
            if (!dropdownMenuOrgSelector.data('loaded')) {
                dropdownMenuOrgSelector.data('loaded', true)
                dropdownMenuOrgSelector.empty();

                dropdownMenuOrgSelector.append('<li><i class="fa fa-check" style="visibility: hidden"></i> Loading...</li>');

                $.ajax({
                    url: '/queries/?userOrgs&groupName=' + groupName,
                    type: 'GET',
                    dataType: 'json',
                    success: function (resp) {

                        var newValues = template(resp);

                        dropdownMenuOrgSelector.empty().append(newValues);
                    }
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