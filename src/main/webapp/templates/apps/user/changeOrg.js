$(function() {
    $('#myModal').on('shown shown.bs.modal', function() {
        flog("modal shown");
        checkInitChangeOrdModal();
//        initChangeOrgModal();
    })
});
function checkInitChangeOrdModal() {
	// Even the simplest things become painful when IE gets involved...
	// IE hasnt laid out the DOM when the event is triggered, so need to wait a bit	
	// But the timing seems variable, so need to poll ... urgh
	if( $("#orgTitle").length > 0 ) {
		initChangeOrgModal();
	} else {
        setTimeout(checkInitChangeOrdModal, 200); 
	}
}
function initChangeOrgModal() {
    var form = $("#changeMemberOrgForm");
    // Guard against double initialisation
    if( form.hasClass("change-org-init") ) {
        return;
    }
    form.addClass("change-org-init");
    flog("initChangeOrgModal", form );
    
    $("#changeMemberOrgForm").forms({
        onSuccess: function(resp, form) {
            window.location.reload();
        }
    });

    $("#orgTitle").typeahead({
        minLength: 2,
        source: function(query, process) {
        	flog("typeahead", query);
            doOrgSearch(query, process);
        },
        updater: function(item) {
            var org = mapOfOrgs[item];
            flog("item: ", item, org);
            $("#orgId").val(org.orgId);
            return item;
        }
    });
    flog("Done init typeahead", $("#orgTitle").length);

    var mapOfOrgs = {};
    function doOrgSearch(query, callback) {
        $.ajax({
            type: 'GET',
            url: window.location.pathname + "?changeMemberOrg=" + $("#changeMemberOrg").val() + "&orgSearchQuery=" + query,
            dataType: "json",
            success: function(data) {
                flog("success", data)
                mapOfOrgs = {};
                orgNames = [];
                $.each(data.data, function(i, state) {
                    //flog("found: ", state, state.title);
                    orgNames.push(state.title);
                    mapOfOrgs[state.title] = state;
                });
                callback(orgNames);
            },
            error: function(resp, textStatus, errorThrown) {
                flog("error", resp, textStatus, errorThrown);
                alert("Error querying the list of organisations");
            }
        });
    }
}