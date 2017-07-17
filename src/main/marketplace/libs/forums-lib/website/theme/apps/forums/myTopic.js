(function($){

    function initMyTopic() {
        flog("initMyTopic", $("#postForumQuestion form"));
        $("#postForumQuestion form").forms({
            onSuccess: function(resp) {
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


    $(document).ready(function(){
        if($('.forum-question-component').length > 0) {
            initMyQuestion();
        }

        if($('#postForumQuestion').length > 0) {
            initMyTopic();
        }
    });

})(jQuery);



