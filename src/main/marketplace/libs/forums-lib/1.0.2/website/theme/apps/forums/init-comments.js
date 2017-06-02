// init-comments.js
$(function() {
    initComments(window.location.pathname);
    $('textarea.autoresize').autogrow();
    
});
/**
 *
 *  Each page should decide what url to pass as the pageUrl, as this can be used
 *  to share comments across pages (such as when the logical context is the folder
 *  the pages are in, rather then each page)
 *
 *  Eg initComments(window.location.pathname);
 */
function initComments(pageUrl) {
    var commentArea = $('.kcommentArea');
    var comments = commentArea.find(".kcommentsWrap");
    flog("initComments", pageUrl);
    commentArea.find(".hideBtn").click(function () {
        var oldCommentsHidden = commentArea.find(".kcommentsWrap:visible").length == 0;
        flog("store new comments hidden", oldCommentsHidden);
        $.cookie("commentsHidden", !oldCommentsHidden, {
            path: "/"
        });
        comments.toggle(100, function () {
            if (!oldCommentsHidden) {
                commentArea.find(".hideBtn a").text("Show comments");
                commentArea.find(".hideBtn a").addClass("ishidden");
            } else {
                commentArea.find(".hideBtn a").text("Hide comments");
                commentArea.find(".hideBtn a").removeClass("ishidden");
            }
        });
        return false;
    });
    var commentsHidden = jQuery.cookie("commentsHidden", {
        path: "/"
    });
    flog("comments hidden", commentsHidden);
    if (commentsHidden === "true") {
        comments.hide();
        commentArea.find(".hideBtn a").text("Show comments");
        commentArea.find(".hideBtn a").addClass("ishidden");
    }

    $("body").on("click focus", ".commentContainer textarea", function (e) {
        $(e.target).closest("div").find(".commentControls").show();
    });
    $('.commentContainer textarea').autogrow()

    var currentUser = {
        name: userName,
        href: userUrl,
        photoHref: "/profile/pic"
    };

    // This is for deferred logins, ie someone logs in after going to a page with comments
    $('body').on('userLoggedIn', function (event, userUrl, userName) {
        currentUser.name = userName;
        currentUser.href = userUrl;
    });


    if (comments.length > 0) {
        comments.comments({
            currentUser: currentUser,
            pageUrl: pageUrl,
            commentTextSelector: '.commentField'
        });
    }
}

