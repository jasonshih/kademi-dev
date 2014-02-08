Bob.onDOMReady(function () {
    $('#myModal').on('shown shown.bs.modal', function() {
        log("modal shown");
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
    log("initChangeOrgModal", form );
    
    $("#changeMemberOrgForm").forms({
        callback: function(resp, form) {
            window.location.reload();
        }
    });

    $("#orgTitle").typeahead({
        minLength: 2,
        source: function(query, process) {
        	log("typeahead", query);
            doOrgSearch(query, process);
        },
        updater: function(item) {
            var org = mapOfOrgs[item];
            log("item: ", item, org);
            $("#orgId").val(org.orgId);
            return item;
        }
    });
    log("Done init typeahead", $("#orgTitle").length);

    var mapOfOrgs = {};
    function doOrgSearch(query, callback) {
        $.ajax({
            type: 'GET',
            url: window.location.pathname + "?changeMemberOrg=" + $("#changeMemberOrg").val() + "&orgSearchQuery=" + query,
            dataType: "json",
            success: function(data) {
                log("success", data)
                mapOfOrgs = {};
                orgNames = [];
                $.each(data.data, function(i, state) {
                    //log("found: ", state, state.title);
                    orgNames.push(state.title);
                    mapOfOrgs[state.title] = state;
                });
                callback(orgNames);
            },
            error: function(resp, textStatus, errorThrown) {
                log("error", resp, textStatus, errorThrown);
                alert("Error querying the list of organisations");
            }
        });
    }
}