var groupAdminPortletInitDone = false;

$(function() {
    if( groupAdminPortletInitDone ) {
        return;
    }
    groupAdminPortletInitDone = true;
    log("init group admi portlet");
    $("body").on("change", "ul.programs input[type=radio]", function(e) {
        log("clicked", e);
        var n = $(e.target);
        var groupName = n.closest("div.Modal").find("h3 span").text();
        var itemHref = n.closest("li").find("a").attr("href");
        saveGroupProgram(groupName, itemHref, n);
    });
});

function showEditProgramsModal(source) {
    var modal = $(source).parent().find(".Modal");
    $.tinybox.show(modal, {
        overlayClose: false,
        opacity: 0
    });    
}

function saveGroupProgram(groupName, itemHref, chk) {
    var value = chk.closest("form").find("input[name='" + chk.attr("name") + "']:checked").val();
    try {
        $.ajax({
            type: 'POST',
            url: itemHref,
            data: {
                group: groupName,
                enrolement: value
            },
            dataType: "json",
            success: function(response) {
                log("saved ok", response);
                $.tinybox.close();                
                var groupDiv = chk.closest("div.Group");
                var groupId = groupDiv.attr("id");
                groupDiv.load(window.location.pathname + " #" + groupId + "> *");
            },
            error: function(resp) {
                log("error", resp);
                alert("An error occured updating the enrolement information");
            }
        });          
    } catch(e) {
        log("exception in createJob", e);
    }        
}