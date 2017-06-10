function initMyTopic() {
    flog("initMyTopic", $("#postForumQuestion form"));
    $("#postForumQuestion form").forms({
        callback: function(resp) {
            log("done post", resp);
            window.location = resp.nextHref;
        }
    });
    $("abbr.timeago").timeago();
    $('.questionNotes').dotdotdot({
        height: 60
    });
}

function initMyQuestion() {
    flog("initMyQuestion");
    $("abbr.timeago").timeago();
}