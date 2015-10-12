/**
 *  jquery.comments-1.0.4.js
 */

(function ($) {
    /**
     * The default configurations of comments
     * @name CommentConfig
     * @namespace
     * @version 1.0.4
     * @property {String} [pageUrl=window.location] The url of the resource to add comments to. Must end with a slash
     * @property {String} [streamSelector=.comments-stream] The selector of stream wrapper which wraps all comments
     * @property {Function} renderCommentFn The callback function to render the markup for a comment. Takes the following arguments user, comment, commentDate, where user is an object containing name, href, photoHref
     * @property {Function} clearContainerFn The callback function to clear the comments container. Takes no arguments
     * @property {Function} ajaxLoadingFn The callback function to show ajax loading. Takes one argument isLoading (true/false)
     * @property {Number} [commentsPerPage=10] The number of comments will be showed per page
     * @property {Function} paginateFn The callback function to render the markeup for pagination
     * @property {Boolean} [aggregated=false] If true will list all comments under the given page
     */
    var DEFAULT_COMMENTS_OPTIONS = {
        pageUrl: window.location,
        streamSelector: '.comments-stream',
        renderCommentFn: function (user, date, comment, commentId) {
            flog('renderCommentFn-104-standard', user, 'container=', container, 'commentId=', commentId);

            var outerDiv = $('#' + commentId);

            if (outerDiv.length === 0) {
                var commentStream = container.find(config.streamSelector);
                flog('Append new comment block to: ', commentStream, "Selector: ", config.streamSelector);

                var commentString = '';

                // User's name and profile picture
                var commentUserString = '';
                if (user !== null && typeof user !== 'undefined') {
                    var profilePic = profileImg(user);
                    commentUserString += '<a class="profilePic comment-user-pic" href="' + user.href + '">' + profilePic + '</a>';
                    commentUserString += '<a class="user comment-user-name" href="' + user.href + '">' + user.name + '</a>';
                } else {
                    commentUserString += '<span class="comment-user-pic profilePic"><img src="/templates/apps/user/profile.png" alt="Anonymous" /></span>';
                    commentUserString += '<span class="user comment-user-name">Anonymous</span>';
                }
                commentString += '<div class="comment-user">';
                commentString += commentUserString;
                commentString += '</div>';

                // Comment content and time
                var commentDetailString = '';

                // Comment text
                commentDetailString += '<p class="comment-content cmt">' + comment + '</p>';

                // Comment reply button
                commentDetailString += '<a class="comment-reply small" href="#">Reply</a>';

                // Comment datetime
                flog('Comment datetime: ', date);
                var dt = {
                    date: date.getDate(),
                    month: date.getMonth(),
                    year: date.getYear(),
                    hour: date.getHours(),
                    minute: date.getMinutes()
                };
                commentDetailString += '<abbr title="' + date.toISOString() + '" class="comment-time auxText small text-muted">' + toDisplayDateNoTime(dt) + '</abbr>';

                // Reply for comment
                commentDetailString += '<div class="comment-replies-wrapper" style="display: none;">';
                commentDetailString += '    <div class="comment-replies"></div>';
                commentDetailString += '    <textarea class="form-control input-sm comment-reply-text" rows="1" placeholder="Write a reply..."></textarea>';
                commentDetailString += '    <div class="text-right">';
                commentDetailString += '        <button type="button" class="btn btn-xs btn-info comment-reply-send">Send</button>';
                commentDetailString += '    </div>';
                commentDetailString += '</div>';

                // Comment comment detail block
                commentString += '<div class="comment-detail">';
                commentString += commentDetailString;
                commentString += '</div>';

                // Append comment block to comment stream
                commentStream.append(
                    '<div class="forumReply comment" id="' + commentId + '">' + commentString + '</div>'
                );
                outerDiv = $('#' + commentId);

                // Event handle for reply text
                var btnReply = outerDiv.find('.comment-reply');
                var replyWrapper = outerDiv.find('.comment-replies-wrapper');

                btnReply.on('click', function (e) {
                    e.preventDefault();

                    if (replyWrapper.is(':visible')) {
                        replyWrapper.hide();
                    } else {
                        replyWrapper.show();
                    }
                });

                var btnSendReply = outerDiv.find('.comment-reply-send');
                var txtReplyText = outerDiv.find('.comment-reply-text');

                btnSendReply.on('click', function (e) {
                    e.preventDefault();

                    var replyText = txtReplyText.val().trim();

                    if (replyText) {
                        flog('Submit reply text:', replyText);
                    }
                });
            } else {
                flog('Update existing comment');

                // Just update
                outerDiv.find('.cmt, .comment-content').html(comment);
            }

            jQuery('abbr.auxText, .comment-time', outerDiv).timeago();
        },
        clearContainerFn: function () {
            container.find(config.streamSelector).html('');
        },
        ajaxLoadingFn: function (isLoading) {
            if (isLoading) {
                ajaxLoadingOn();
            } else {
                ajaxLoadingOff();
            }
        },
        itemsPerPage: 10,
        paginateFn: function (comments, config, container) {
            flog('paginateFn-104-standard', comments, config, container);

            var totalComments = comments.length;
            var itemsPerPage = config.itemsPerPage;

            if (totalComments > itemsPerPage) {
                container.prepend(
                    '<div class="well well-sm text-center">' +
                    '    <a href="" class="btn-show-more">Show previous comments</a>'+
                    '</div>'
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
        aggregated: false  // if true will list all comments under the given page
    };

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
     * @version 1.0.4
     * @param {CommentConfig} options Configuration of comment
     */
    $.fn.comments = function (options) {
        var container = this;
        var config = $.extend({}, DEFAULT_COMMENTS_OPTIONS, options);

        var form = container.find('form');
        flog('Register submit event: ', form);

        form.submit(function (e) {
            e.preventDefault();
            e.stopPropagation();

            try {
                sendNewForumComment(config.pageUrl, container.find('textarea'), config.renderCommentFn, config.currentUser);
            } catch (e) {
                flog('Exception sending forum comment', e);
            }
            return false;
        });
        initWebsockets(config);

        loadComments(config, container);
    };

    function initWebsockets(config) {
        var path = getFolderPath(window.location.pathname);
        flog('initWebsockets', window.location.host, path);
        var b64ContentId = Base64.encode(path);
        try {
            wsocket = new WebSocket('ws://' + window.location.host + '/comments/' + window.location.host + '/content/' + b64ContentId);
            wsocket.onmessage = function (evt) {
                var c = $.parseJSON(evt.data);
                flog('onMessage', c);

                var dt = new Date(c.date);
                config.renderCommentFn(c.user, dt, c.comment, c.id, c);
            };

            flog('Done initWebsockets');
        } catch (e) {
            // TODO: setup polling to load comments every minute or so
            flog('Websocket initialisation failed. Live comment stream is not available');
        }
    }

})(jQuery);

function sendNewForumComment(pageUrl, commentInput, renderComment, currentUser) {
    flog('sendNewForumComment', pageUrl, commentInput, renderComment, currentUser);

    var comment = commentInput.val();
    commentInput.removeClass('errorField');

    if (comment.trim().length < 1) {
        commentInput.addClass('errorField');
        return;
    }

    var url = pageUrl;
    if (!url.endsWith('/')) {
        url += '/';
    }
    url += '_comments';

    ajaxLoadingOn();

    $.ajax({
        type: 'POST',
        url: url,
        data: {newComment: comment},
        dataType: 'json',
        success: function (resp) {
            ajaxLoadingOff();

            commentInput.val('');
            commentInput.keyup();

            flog('resp', resp.status, resp);
            if (resp.status) {
                var c = resp.data;
                currentDate = new Date();

                invokeRenderFn(c, renderComment);
            } else {
                alert('Sorry, there was a problem posting your comment. Please try again');
            }
        },
        error: function () {
            ajaxLoadingOff();
            alert('Sorry, we could not process your comment. Please try again later');
        }
    });
}

function loadComments(config, container) {
    flog('loadComments');

    var page = config.pageUrl;
    var clearContainerFn = config.clearContainerFn;

    var url = page;
    if (!url.endsWith('/')) {
        url += '/';
    }
    url += '_comments';

    $.getJSON(url, function (response) {
        flog('got comments response', response);
        clearContainerFn();
        processComments(response, config, container);
    }).fail(function () {
        flog('Failed to load comments', container);
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
