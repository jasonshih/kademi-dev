(function () {
    function initLoginPanel(panel) {
        flog('initLoginPanel', panel);
        
        var redirectUrl = panel.attr('data-redirect-url');
        if (!redirectUrl || redirectUrl === 'null') {
            redirectUrl = null;
        }
        var isAutoRedirect = panel.attr('data-auto-redirect') === 'true' && !location.pathname.endsWith('/contenteditor');
        var loginContainer = panel.find('.login-container')
        
        flog('initLoginPanel | Redirect url: ' + redirectUrl + ', isAutoRedirect: ' + isAutoRedirect);
        
        if (loginContainer.length > 0) {
            loginContainer.user({
                afterLoginUrl: redirectUrl,
                valiationMessageSelector: 'p.login.message'
            });
        } else {
            flog('initLoginPanel | Already logged in');
            
            if (isAutoRedirect && redirectUrl && window.location.pathname !== redirectUrl) {
                flog('initLoginPanel | Redirecting to: ' + redirectUrl);
                document.body.innerHTML = '';
                document.title = 'Redirecting...';
                window.location.href = redirectUrl;
            }
        }
    }
    
    $(function () {
        $('.panel-user-login').each(function () {
            initLoginPanel($(this));
        });
    });
    
})(jQuery);