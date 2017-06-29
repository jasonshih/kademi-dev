$(function () {
    initContentSearch();
});
function initContentSearch() {
    flog("initContentSearch");

    var txtKeyword = $("input[name=omni]");
    var searchResults = $('#omni-search-suggestions');
    txtKeyword.on({
        keyup: function () {
            var query = $(this).val();
            typewatch(function () {
                flog("do search ", query);
                // Load fragment
                try {
                    var href = 'contentSearch';
                    $.ajax({
                        url: href,
                        type: 'GET',
                        data: {
                            omni: query.trim()
                        },
                        dataType: 'html',
                        success: function (data) {
                            flog("complete");
                            searchResults.html(data);
                            searchResults.removeClass("hide");
                        }
                    });
                } catch (e) {
                    flog("ERROR: " + e);
                }
            }, 500);
        },
        input: function () {
            var query = $(this).val() || '';
            if (query.trim() === '') {
                flog("Query is empty. Clear search result panel!", searchResults);
                searchResults.html('');
            }
        }
    });

    //txtKeyword.keyup();

    txtKeyword.closest('form').on('submit', function (e) {
        var keyword = txtKeyword.val().trim();

        if (!keyword) {
            e.preventDefault();
        }
    });
}
