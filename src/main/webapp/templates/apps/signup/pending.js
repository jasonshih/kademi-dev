$(function () {
    $("abbr.timeago").timeago();

    $('.collapse').on('hidden.bs.collapse', function (e) {
        $(e.currentTarget.parentNode).hide();
    });
    
    $('.collapse').on("show.bs.collapse",function(e){
        $(e.currentTarget.parentNode).show();
    });

    $(".pendingAccounts button.accept").click(function (e) {
        e.stopPropagation();
        e.preventDefault();
        setStatus($(e.target), true);
    });
    $(".pendingAccounts button.reject").click(function (e) {
        e.stopPropagation();
        e.preventDefault();
        if (confirm("Are you sure you want to reject this application?")) {
            setStatus($(e.target), false);
        }
    });

    function setStatus(btn, isEnabled) {
        var tr = btn.closest("tr");
        var appId = tr.find("input[name=appId]").val();
        var details = $(".det-" + appId);
        log("setStatus", appId, isEnabled);
        $.ajax({
            type: 'POST',
            url: "pendingApps", // Post to orgfolder/pendingApps
            dataType: "json",
            data: {
                applicationId: appId,
                enable: isEnabled
            },
            success: function (data) {
                log("response", data);
                if (!data.status) {
                    Msg.error("An error occured processing the request. Please refresh the page and try again: " + data.messages);
                    return;
                }
                tr.remove();
                details.remove();
            },
            error: function (resp) {
                log("error", resp);
                Msg.error("An error occured processing the request. Please refresh the page and try again");
            }
        });
    }
});