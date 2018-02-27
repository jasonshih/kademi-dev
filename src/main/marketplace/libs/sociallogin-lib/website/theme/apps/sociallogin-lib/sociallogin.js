(function (w, $) {
    // Handle Facebook share callback
    function initFacebookShare() {
        flog('initFacebookShare');
        $('body').on('click', '.facebookShareButton', function (e) {
            e.preventDefault();

            var btn = $(this);
            var url = btn.data('shareurl');
            var successmsg = btn.data('successmsg');

            FB.ui({
                method: 'share',
                display: 'popup',
                href: url
            }, function (response) {
                if ($.isArray(response)) {
                    Msg.success(successmsg);
                    sendSocialInteraction('facebook', 'share', url, successmsg);
                } else {
                    Msg.danger("Unable to share to Facebook.");
                }
            });
        });
    }

    // Init linkedinShareButton
    function initLinkedinShareButton() {
        flog("initLinkedinShareButton");

        $('body').on('click', '.linkedinShareButton', function (e) {
            e.preventDefault();

            var btn = $(this);
            var url = btn.data('shareurl');
            var successmsg = btn.data('successmsg');

            if (IN.User.isAuthorized()) {
                postLinkedInShare(url, successmsg);
            } else {
                IN.User.authorize(function () {
                    if (IN.User.isAuthorized()) {
                        postLinkedInShare(url);
                    } else {
                        Msg.danger("Unable to share to LinkedIn, Not authorized.");
                    }
                });
            }
        });
    }

    function postLinkedInShare(url, successmsg) {
        var payload = {
            "content": {
                "submitted-url": url
            },
            "visibility": {
                "code": "anyone"
            }
        };

        IN.API.Raw("/people/~/shares?format=json")
                .method("POST")
                .body(JSON.stringify(payload))
                .result(function () {
                    Msg.success(successmsg);
                    sendSocialInteraction('linkedin', 'share', url);
                })
                .error(function () {
                    Msg.danger("Unable to share to LinkedIn.");
                });
    }

    function sendSocialInteraction(provider, type, url) {
        $.ajax({
            url: '/socialInteraction',
            type: 'POST',
            dataType: 'JSON',
            data: {
                saveInteraction: true,
                provider: provider,
                type: type,
                url: url
            }
        });
    }

    $(function () {
        // Init Facebook
        if (w.fbInitDone === null || typeof w.fbInitDone === 'undefined') {
            w.fbInitDone = [];
        }

        if (w.fbAsyncInitDone) {
            initFacebookShare();
        } else {
            w.fbInitDone.push(initFacebookShare);
        }

        // Init LinkedIn
        if (w.linkedinInitFunctions === null || typeof w.linkedinInitFunctions === 'undefined') {
            w.linkedinInitFunctions = [];
        }

        if (w.linkedinInitDone) {
            initLinkedinShareButton();
        } else {
            w.linkedinInitFunctions.push(initLinkedinShareButton());
        }
    });
})(window, jQuery);