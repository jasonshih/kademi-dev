function initManagePointsSystems() {
    flog("initManagePointsSystems");
    initController();
    $("#manageReward .Add").click(function() {
        showAddReward(this);
    });
    $("#manageReward form.addReward").forms({
        callback: function(resp) {
            flog("done");
            window.location.href = resp.nextHref;
        }
    });
}


function initController() {
    //Bind event for Delete reward
    $("body").on("click", "a.DeleteReward", function(e) {
        e.preventDefault();
        var link = $(e.target).closest("a");
        var href = link.attr("href");

        confirmDelete(href, href, function() {
            flog("remove it");
            link.closest("tr").remove();
            link.closest("li").remove();
            Msg.success('Reward is deleted!');
        });
    });
}
