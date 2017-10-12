(function ($) {
    /**
     *
     *  Each page should decide what url to pass as the pageUrl, as this can be used
     *  to share comments across pages (such as when the logical context is the folder
     *  the pages are in, rather then each page)
     *
     *  Eg initComments(window.location.pathname);
     */
    function initComments(pageUrl) {
        flog('initComments', pageUrl);
        
        var commentArea = $('.kcomments-area');
        var comments = commentArea.find('.kcomments-wrapper');
        
        if (comments.length > 0) {
            var btnShowHideComment = commentArea.find('.btnShowHideComment');
            btnShowHideComment.click(function (e) {
                e.preventDefault();
                
                var isVisible = commentArea.find('.kcomments-wrapper').is(':visible');
                flog('store new comments hidden', isVisible);
                $.cookie('commentsHidden', !isVisible, {
                    path: '/'
                });
                
                if (isVisible) {
                    comments.fhide();
                    btnShowHideComment.text('Show comments').addClass('is-hidden');
                } else {
                    comments.fshow();
                    btnShowHideComment.text('Hide comments').removeClass('is-hidden');
                }
            });
            
            var commentsHidden = $.cookie('commentsHidden', {
                path: '/'
            });
            
            if (commentsHidden === 'true') {
                comments.hide();
                btnShowHideComment.text('Show comments').addClass('is-hidden');
            }
            
            commentArea.find('textarea').autogrow();
            
            var currentUser = {
                name: userName,
                href: userUrl,
                photoHref: '/profile/pic'
            };
            
            // This is for deferred logins, ie someone logs in after going to a page with comments
            $(document.body).on('userLoggedIn', function (event, userUrl, userName) {
                currentUser.name = userName;
                currentUser.href = userUrl;
            });
            
            comments.comments({
                currentUser: currentUser,
                pageUrl: pageUrl,
                commentTextSelector: '.kcomment-textarea'
            });
        }
    }
    
    $(function () {
        initComments(window.location.pathname);
    });
    
})(jQuery);


