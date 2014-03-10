function initContentSearch() {
    log("initContentSearch");
    $.getScriptOnce('/theme/js/typeahead.js', function() {
        $("#orgName").typeahead({
            minLength: 1,
            valueKey: "title",
            name: "orgs",
            remote: '/contentSearch?jsonQuery=%QUERY&th', // set the 'th' flag to get responses in typeahead format
            template: function (datum) {
                return '<div>' + datum.title + ' ' + datum.address + '</span></div>'
            }
        });
        $("#orgName").on("typeahead:selected", function(e, datum) {
            log("Selected", e, datum);
            $("#orgId").val(datum.orgId);
        });
    });

}
