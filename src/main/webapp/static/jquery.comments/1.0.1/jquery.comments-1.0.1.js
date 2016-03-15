(function ($) {
    /**
     * The default configurations of comments
     * @name CommentConfig
     * @namespace
     * @version 1.0.1
     * @property {String} [pageUrl=window.location] The url of the resource to add comments to. Must end with a slash
     * @property {String} [streamSelector=.comments-stream] The selector of stream wrapper which wraps all comments
     * @property {Function} renderCommentFn The callback function to render the markup for a comment. Takes the following arguments user, 
     * comment, commentDate, where user is an object containing name, href, photoHref
     * @property {Function} clearContainerFn The callback function to clear the comments container. Takes no arguments
     * @property {Function} ajaxLoadingFn The callback function to show ajax loading. Takes one argument isLoading (true/false)
     * @property {Number} [commentsPerPage=10] The number of comments will be showed per page
     * @property {Function} paginateFn The callback function to render the markeup for pagination
     * @property {Boolean} [aggregated=false] If true will list all comments under the given page 
     */
     var defaultCommentConfig = {
        pageUrl: window.location,
        streamSelector: ".comments-stream",
        renderCommentFn: function (user, date, comment, commentId) {
            log("renderCommentFn-101-standard", user, "container=", container, "commentId=", commentId);
            if (user === null) {
                log("no user so dont render");
                return;
            }
            var outerDiv = $("#" + commentId);
            log("outerDiv", commentId, outerDiv);
            if (outerDiv.length === 0) {
                log("add comment");
                outerDiv = $("<div class='forumReply'></div>");
                outerDiv.attr("id", commentId);
                var commentStream = container.find(config.streamSelector);
                flog("append to", commentStream, "sel", config.streamSelector);
                commentStream.append(outerDiv);
                var profilePic = profileImg(user);
                var profLink = $("<a class='profilePic' href='" + user.href + "'>" + profilePic + "</a>");
                var nameLink = $("<a class='user' href='" + user.href + "'>" + user.name + "</a>");
                var commentPara = $("<p class='cmt'></p>");
                commentPara.html(comment);

                var dateSpan = $("<abbr title='" + date.toISOString() + "' class='auxText'>" + toDisplayDateNoTime(date) + "</abbr>");
                var toolsDiv = $("<div></div>");
                outerDiv.append(profLink);
                outerDiv.append(nameLink);
                outerDiv.append(commentPara);
                outerDiv.append(dateSpan);
                outerDiv.append(toolsDiv);
            } else {
                log("update");
                // Just update
                outerDiv.find(".cmt").html(comment);
            }

            jQuery("abbr.auxText", outerDiv).timeago();
        },
        clearContainerFn: function () {
            container.find(config.streamSelector).html("");
        },
        ajaxLoadingFn: function (isLoading) {
            if (isLoading) {
                ajaxLoadingOn();
            } else {
                ajaxLoadingOff();
            }
        },
        commentsPerPage: 10,
        paginateFn: function (comments, config, container) {
            log("paginateFn-101-standard", comments, config, container);

            var totalComments = comments.length;
            var commentsPerPage = config.commentsPerPage;

            if (totalComments > commentsPerPage) {
                container.prepend(
                    '<div class="well well-sm text-center"><a href="" class="btn-show-more">Show previous comments</a></div>'
                );

                var commentWrappers = container.find('.forumReply');

                // Show 10 last comments
                commentWrappers.filter(':lt(' + (totalComments - commentsPerPage) + ')').hide().addClass('hidden-comment');

                container.find('.btn-show-more').click(function (e) {
                    e.preventDefault();

                    var hiddenCommentWrappers = commentWrappers.filter('.hidden-comment');
                    var totalHiddenComments = hiddenCommentWrappers.length;

                    hiddenCommentWrappers.filter(':gt(' + (totalHiddenComments - commentsPerPage - 1) + ')').show().removeClass('hidden-comment');

                    if (totalHiddenComments <= commentsPerPage) {
                        $(this).parent().hide();
                    }
                });
            }
        },
        aggregated: false  // if true will list all comments under the given page 
    }

    /**
     * See (http://jquery.com/).
     * @name $
     * @class
     * See the jQuery Library (http://jquery.com/) for full details. This just
     * documents the function and classes that are added to jQuery by this plug-in.
     */

    /**
     * See (http://jquery.com/)
     * @name fn
     * @class
     * See the jQuery Library (http://jquery.com/) for full details. This just
     * documents the function and classes that are added to jQuery by this plug-in.
     * @memberOf $
     */

    /**
     * Show comments
     * @name comments
     * @class
     * @memberOf $.fn
     * @version 1.0.1
     * @param {CommentConfig} options Configuration of comment
     */
    $.fn.comments = function (options) {
        var container = this;
        var config = $.extend({}, defaultCommentConfig, options);

        log("register submit event", $("form", this));

        $("form", this).submit(function (e) {
            e.preventDefault();
            e.stopPropagation();
            try {
                sendNewForumComment(config.pageUrl, $("textarea", this), config.renderCommentFn, config.currentUser);
            } catch (e) {
                log("exception sending forum comment", e);
            }
            return false;
        });
        initWebsockets(config);

        loadComments(config, container);
    };

    function initWebsockets(config) {
        var path = getFolderPath(window.location.pathname);
        log("initWebsockets", window.location.host, path);
        var b64ContentId = Base64.encode(path);
        try {
            var port = parseInt(window.location.port || 80) + 1;
            var proto = 'ws://';
            if (window.location.protocol === 'https:') {
                proto = 'wss://';
                port = parseInt(window.location.port || 443) + 1;
            }
            wsocket = new WebSocket(proto + window.location.hostname + ':' + port + '/comments/' + window.location.hostname + '/content/' + b64ContentId);
            wsocket.onmessage = function (evt) {
                var c = $.parseJSON(evt.data);
                log("onMessage", c);
                var dt = new Date(c.date);
                config.renderCommentFn(c.user, dt, c.comment, c.id);
            };
            log("done initWebsockets");
        } catch (e) {
            // TODO: setup polling to load comments every minute or so
            log("Websocket initialisation failed. Live comment stream is not available");
        }
    }

})(jQuery);


function sendNewForumComment(pageUrl, commentInput, renderComment, currentUser) {
    log("sendNewForumComment", pageUrl, commentInput, currentUser);
    if (currentUser.href === null) {
        alert("You must be logged in to post comments");
        return;
    }
    var comment = commentInput.val();
    commentInput.removeClass("errorField");
    if (comment.trim().length < 1) {
        commentInput.addClass("errorField");
        return;
    }
    var url = pageUrl;
    if (!url.endsWith("/")) {
        url += "/";
    }
    url += "_comments";
    ajaxLoadingOn();
    $.ajax({
        type: 'POST',
        url: url,
        data: {newComment: comment},
        dataType: "json",
        success: function (resp) {
            ajaxLoadingOff();
            commentInput.val('');
            commentInput.keyup();
            log("resp", resp.status, resp);
            if (resp.status) {
                currentDate = new Date();
                var c = resp.data;
                invokeRenderFn(c, renderComment);
            } else {
                alert("Sorry, there was a problem posting your comment. Please try again");
            }
        },
        error: function () {
            ajaxLoadingOff();
            alert('Sorry, we could not process your comment. Please try again later');
        }
    });
}

function loadComments(config, container) {
    var page = config.pageUrl;
    var renderCommentFn = config.renderCommentFn;
    var clearContainerFn = config.clearContainerFn;
    var aggregated = config.aggregated;

    commentUrl = page;
    var url = page;
    if (!url.endsWith("/")) {
        url += "/";
    }
    url += "_comments";

    $.getJSON(url,function (response) {
        log("got comments response", response);
        clearContainerFn();
        processComments(response, config, container);
    }).fail(function () {
        log("Failed to load comments", container);
        clearContainerFn();
        if (container) {
            container.hide();
        }
    });
}

function processComments(comments, config, container) {
    if (comments) {
        comments.sort(dateOrd);
        $.each(comments, function (i, comment) {
            invokeRenderFn(comment, config.renderCommentFn);
        });
        config.paginateFn(comments, config, container);
    }
}

function invokeRenderFn(comment, renderCommentFn) {
    var dt = new Date(comment.date);
    renderCommentFn(comment.user, dt, comment.comment, comment.id);
}