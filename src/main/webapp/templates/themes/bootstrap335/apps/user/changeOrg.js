$(function() {
    flog("init change modal", $('#myModal'));
    $('#myModal').on('shown shown.bs.modal show.bs.modal', function() {
        flog("modal shown");
        initChangeOrgModal();
    })
});
function initChangeOrgModal() {
    flog("initChangeOrgModal", $("#changeMemberOrgForm"));
    $("#changeMemberOrgForm").forms({
        onSuccess: function(resp, form) {
            window.location.reload();
        }
    });

    $.getScript("/static/typeahead/0.10.2/typeahead.bundle.js", function() {
        $.getScript("http://twitter.github.io/typeahead.js/js/handlebars.js", function() {
            try {

                var orgs = new Bloodhound({
                    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
                    queryTokenizer: Bloodhound.tokenizers.whitespace,
                    remote: {
                        url: window.location.pathname,
                        //url: searchUrl + '?jsonQuery=%QUERY&th',
                        replace: function() {
                            return window.location.pathname + "?changeMemberOrg=" + $("#changeMemberOrg").val() + "&orgSearchQuery=" + encodeURIComponent($("#orgTitle").val()) + '&th';
                        }
                    }
                });

                orgs.initialize();

                $("#orgTitle").typeahead(null, {
                    minLength: 1,
                    valueKey: "title",
                    name: "orgs",
                    source: orgs.ttAdapter(),
                    templates: {
                        empty: [
                            '<div class="empty-message">',
                            'No organisations match your search',
                            '</div>'
                        ].join('\n'),
                        suggestion: Handlebars.compile('<p><strong>{{title}}</strong> ({{postcode}})</p>')
                    }
                });
                flog("init typeahead2", $("#orgTitle"));
                $("#orgTitle").on("typeahead:selected", function(e, datum) {
                    log("Selected", e, datum);
                    $("#orgId").val(datum.orgId);
                });
                flog("init typeahead3");
            } catch (e) {
                flog("exception: " + e);
            }
        });
    });

//    $.getScript("/theme/js/typeahead.js", function() {        
//        flog("loaded typeahead...");
//        try {
//            var remoteUrl = window.location.pathname + "?changeMemberOrg=" + $("#changeMemberOrg").val() + "&orgSearchQuery=%QUERY&th";
//            $("#orgTitle").typeahead({
//                minLength: 1,
//                valueKey: "title",
//                name: "orgs",
//                remote: remoteUrl,
//                template: function (datum) {
//                    return '<div>' + datum.title + ' ' + datum.address + '</span></div>'
//                }
//            });
//            $("#orgTitle").on("typeahead:selected", function(e, datum) {
//                flog("Selected", e, datum);
//                $("#orgId").val(datum.orgId);
//            });
//            flog("finished typeahead init");
//        } catch(e) {
//            flog("EXCEPTION", e);
//        }
//    });    


//
//    $("#orgTitle").typeahead({
//        minLength: 2,
//        source: function(query, process) {
//            doOrgSearch(query, process);
//        },
//        updater: function(item) {
//            var org = mapOfOrgs[item];
//            log("item: ", item, org);
//            $("#orgId").val(org.id);
//            return item;
//        }
//    });
//
//
//    var mapOfOrgs = {};
//    function doOrgSearch(query, callback) {
//        $.ajax({
//            type: 'GET',
//            url: window.location.pathname + "?changeMemberOrg=" + $("#changeMemberOrg").val() + "&orgSearchQuery=" + query,
//            dataType: "json",
//            success: function(data) {
//                log("success", data)
//                mapOfOrgs = {};
//                orgNames = [];
//                $.each(data.data, function(i, state) {
//                    //log("found: ", state, state.title);
//                    orgNames.push(state.title);
//                    mapOfOrgs[state.title] = state;
//                });
//                callback(orgNames);
//            },
//            error: function(resp, textStatus, errorThrown) {
//                log("error", resp, textStatus, errorThrown);
//                alert("Error querying the list of organisations");
//            }
//        });
//    }
}