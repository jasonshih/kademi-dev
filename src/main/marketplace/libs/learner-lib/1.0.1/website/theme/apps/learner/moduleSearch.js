function initModuleSearch() {
    flog("initModuleSearch");
    var dirName = getFolderPath(window.location.pathname);
    $(".search-module").keyup(function() {
        var query = $(this).val();
        flog("search keyup");
        typewatch(function() {
            doElasticSearch(query, dirName);
        }, 500);
    });

    function doElasticSearch(query, dirName) {
        flog("doElasticSearch", dirName, query);
        var modulePages = $(".modPage");
        query = cleanString(query);
        if (query === null) {
            modulePages.show();
        } else {
            $.ajax({
                type: 'GET',
                url: dirName + "/contentSearch?q=" + query + '&asJson=json',
                datatype: "json",
                success: function(data) {
//                data = $.parseJSON(data);

                    flog("success", data);
                    // render the search result
                    if (data.searchResults.length > 0) {
                        modulePages.hide();
                        $.each(data.searchResults, function(idx, result) {
                            flog("result", result);
                            var p = result.path;
                            var fname = getFileName(p);
                            flog("find page", fname, " in ", modulePages);
                            var link = modulePages.filter("a[href='" + fname + "']");
                            flog("path", p, link);
                            link.show();
                        });
                    } else {
                        modulePages.show();
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    flog("An error occured doing the user search. Please check your internet connection and try again");
                    // Error
                    flog(jqXHR, textStatus, errorThrown);
                }
            });
        }
    }

    /**
     * Returns null or a non-blank string
     * 
     * @param {type} s
     * @returns {unresolved}
     */
    function cleanString(s) {
        if (s === null) {
            return s;
        }
        s = s.trim();
        if (s.length === 0) {
            return null;
        }
        return s;
    }
}
