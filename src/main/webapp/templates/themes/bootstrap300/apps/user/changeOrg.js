$(function() {
    $('#myModal').on('shown shown.bs.modal', function() {
        log("modal shown");
        initChangeOrgModal();
    })
});
function initChangeOrgModal() {
    log("initChangeOrgModal", $("#changeMemberOrgForm"));
    $("#changeMemberOrgForm").forms({
        callback: function(resp, form) {
            window.location.reload();
        }
    });
    
    $.getScript("/theme/js/typeahead.js", function() {        
        var remoteUrl = window.location.pathname + "?changeMemberOrg=" + $("#changeMemberOrg").val() + "&orgSearchQuery=%QUERY&th";
        $("#orgTitle").typeahead({
            minLength: 1,
            valueKey: "title",
            name: "orgs",
            remote: remoteUrl,
            template: function (datum) {
                return '<div>' + datum.title + ' ' + datum.address + '</span></div>'
            }
        });
        $("#orgTitle").on("typeahead:selected", function(e, datum) {
            log("Selected", e, datum);
            $("#orgId").val(datum.orgId);
        });
    });    
    
    
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