(function ($, window) {
    window.initPosts = function (basePath) {
        flog('initPosts', basePath);
        
        $.getJSON(basePath + '_postSearch?a', function (response) {
            processPosts(response);
        });
    }
    
    function processPosts(comments) {
        flog('processPosts', comments);
        
        if (comments) {
            var commentsStream = $('.panel-recent-posts .kcomments-stream');
            
            if (comments.length > 0) {
                commentsStream.html('');
                $.each(comments.sort(dateOrd), function (i, comment) {
                    // pageTitle and pagePath are only present for aggregated results
                    displayPost(comment.user, new Date(comment.date), comment.notes, comment.contentTitle, comment.contentHref);
                });
                
                commentsStream.find('.comment-time').timeago();
            } else {
                commentsStream.html('<p>No recent posts</p>');
            }
        }
    }
    
    function displayPost(user, date, comment, pageTitle, pagePath) {
        flog('displayPost', user, date, comment, pageTitle, pagePath);
        
        if (!user) {
            return;
        }
        
        var userPublicLink = '/users/' +  user.userName+ '/public';
        var userPhoto = user.photoHash || '/templates/apps/user/profile.png';
        var formattedDate = date.toISOString();
        
        $('.panel-recent-posts .kcomments-stream').append(
            '<div class="comment">' +
            '    <div class="comment-user">' +
            '        <a class=" comment-user-pic" href="' + userPublicLink + '">' +
            '            <img src="' + userPhoto + '" alt="' + user.name + '" />' +
            '        </a>' +
            '    </div>' +
            '    <div class="comment-detail">' +
            '        <p class="comment-content">' +
            '            <a class="comment-user-name" href="' + userPublicLink + '">' + user.name + '</a>' +
            '            posted in <a href="' + pagePath + '" target="_blank">' + pageTitle + '</a>' +
            '        </p>' +
            '        <abbr title="' + formattedDate + '" class="comment-time small text-muted">' + formattedDate + '</abbr>' +
            '    </div>' +
            '</div>'
        );
    }
    
})(jQuery, window);