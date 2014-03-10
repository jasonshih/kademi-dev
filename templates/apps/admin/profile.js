function initProfile() {
    log("initProfile");
    initOrgSearch();
    initNewMembershipForm();
    $("form").not("#modal-membership form").forms({
        callback: function(resp, form) {                        
            confirmMessage = form.closest("div").find("p.confirm");                        
            log("done", confirmMessage);
            confirmMessage.show(500, function() {
                confirmMessage.hide(5000);
            })
        }
    });

    $("#myUploaded").mupload({
        url: "",
        buttonText: "Select a new photo",
        oncomplete: function(data, name, href) {
            log("set img", $(".profile-photo img"));
            $(".profile-photo img").attr("src", "pic");
        }
    });

    log("init delete membersip");
    $("div.memberships-wrapper").on("click", "a.btn-delete-membership", function(e) {
        log("click", this);
        e.preventDefault();
        e.stopPropagation();
        if( confirm("Are you sure you want to delete this group membership? WARNING: If this is the last membership you will not be able to edit the user.")) {
            var a = $(e.target);
            log("do it", a);
            var href = a.attr("href");
            deleteFile(href, function() {
                a.closest("li").remove();
            });
        }
    });
}

function initNewMembershipForm() {
    var modal = $("#modal-membership");

    $(".btn-add-group").click(function(e) {
        e.preventDefault();
        e.stopPropagation();
	    modal.modal('show');
    });

    modal.find("form").forms({
        callback: function(resp) {
            log("done new membership", resp);
            modal.modal('hide');
            reloadMemberships();
        }
    });   
}

function reloadMemberships() {
    $.ajax({
        type: 'GET',
        url: window.location.pathname,
        success: function(data) {
            log("success", data);
            var $fragment = $(data).find("ul#user-membership");
            var orig = $("ul#user-membership");
            log("replace", orig, $fragment);
            orig.replaceWith($fragment);
        },
        error: function(resp) {
            alert("error: " + resp);
        }
    });      
}