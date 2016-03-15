/**
 *
 *  jquery-comments.js
 *
 * Config:
 * pageUrl - url of the resource to add comments to. Must end with a slash
 * a submit handler
 * renderCommentFn - a callback function to render the markup for a comment. Takes the following arguments user, comment, commentDate, where user
 * is an object containing name, href, photoHref
 * clearContainerFn - callback function to clear the comments container. Takes no arguments
 * ajaxLoadingFn - callback function to show ajax loading. Takes one argument isLoading (true/false)
 * currentUser - user object containing name, href, photoHref
 * streamSelector - jquery selector for the contained element to hold the comment stream
 *
 */

(function ($) {
    $.fn.comments = function (options) {
        var container = this;
        var config = $.extend({
            'pageUrl': window.location,
            'streamSelector': ".comments-stream",
            'renderCommentFn': function (user, date, comment, commentId) {
                flog("renderCommentFn-101-standard", user, "container=", container, "commentId=", commentId);
                if (user === null) {
                    flog("no user so dont render");
                    return;
                }
                var outerDiv = $("#" + commentId);

                if (outerDiv.length === 0) {
                    flog("add comment");
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

                    flog("dt", date);
                    var dt = {
                        date: date.getDate(),
                        month: date.getMonth(),
                        year: date.getYear(),
                        hour: date.getHours(),
                        minute: date.getMinutes()
                    };

                    var dateSpan = $("<abbr title='" + date.toISOString() + "' class='auxText'>" + toDisplayDateNoTime(dt) + "</abbr>");

                    var toolsDiv = $("<div></div>");
                    outerDiv.append(profLink);
                    outerDiv.append(nameLink);
                    outerDiv.append(commentPara);
                    outerDiv.append(dateSpan);
                    outerDiv.append(toolsDiv);
                } else {
                    flog("update");
                    // Just update
                    outerDiv.find(".cmt").html(comment);
                }

                jQuery("abbr.auxText", outerDiv).timeago();
            },
            'clearContainerFn': function () {
                container.find(config.streamSelector).html("");
            },
            'ajaxLoadingFn': function (isLoading) {
                if (isLoading) {
                    ajaxLoadingOn();
                } else {
                    ajaxLoadingOff();
                }
            },
            itemsPerPage: 10,
            'paginateFn': function (comments, config, container) {
                flog("paginateFn-101-standard", comments, config, container);

                var totalComments = comments.length;
                var itemsPerPage = config.itemsPerPage;

                if (totalComments > itemsPerPage) {
                    container.prepend(
                        '<div class="well well-sm text-center"><a href="" class="btn-show-more">Show previous comments</a></div>'
                    );

                    var commentWrappers = container.find('.forumReply');

                    // Show 10 last comments
                    commentWrappers.filter(':lt(' + (totalComments - itemsPerPage) + ')').hide().addClass('hidden-comment');

                    container.find('.btn-show-more').click(function (e) {
                        e.preventDefault();

                        var hiddenCommentWrappers = commentWrappers.filter('.hidden-comment');
                        var totalHiddenComments = hiddenCommentWrappers.length;

                        hiddenCommentWrappers.filter(':gt(' + (totalHiddenComments - itemsPerPage - 1) + ')').show().removeClass('hidden-comment');

                        if (totalHiddenComments <= itemsPerPage) {
                            $(this).parent().hide();
                        }
                    });
                }
            },
            'aggregated': false  // if true will list all comments under the given page
        }, options);

        flog("register submit event", $("form", this));

        $("form", this).submit(function (e) {
            e.preventDefault();
            e.stopPropagation();
            try {
                sendNewForumComment(config.pageUrl, $("textarea", this), config.renderCommentFn, config.currentUser);
            } catch (e) {
                flog("exception sending forum comment", e);
            }
            return false;
        });
        initWebsockets(config);

        loadComments(config, container);
    };

    function initWebsockets(config) {
        var path = getFolderPath(window.location.pathname);
        flog("initWebsockets", window.location.host, path);
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
                flog("onMessage", c);
                var dt = new Date(c.date);
                config.renderCommentFn(c.user, dt, c.comment, c.id, c);
            };
            flog("done initWebsockets");
        } catch (e) {
            // TODO: setup polling to load comments every minute or so
            flog("Websocket initialisation failed. Live comment stream is not available");
        }
    }

})(jQuery);

function sendNewForumComment(pageUrl, commentInput, renderComment, currentUser) {
    flog("sendNewForumComment", pageUrl, commentInput, currentUser);
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
            flog("resp", resp.status, resp);
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
    flog("loadComments");
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
        flog("got comments response", response);
        clearContainerFn();
        processComments(response, config, container);
    }).fail(function () {
        flog("Failed to load comments", container);
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
