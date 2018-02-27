(function (w, $) {
    // Handle Facebook share callback
    function initFacebookShare() {
        flog('initFacebookShare');
        $('body').on('click', '.facebookShareButton', function (e) {
            e.preventDefault();

            var btn = $(this);
            var url = btn.data('shareurl');

            FB.ui({
                method: 'share',
                display: 'popup',
                href: url
            }, function (response) {
                if ($.isArray(response)) {
                    $.ajax({
                        url: '/socialInteraction',
                        type: 'POST',
                        dataType: 'JSON',
                        data: {
                            saveInteraction: true,
                            provider: 'facebook',
                            type: 'share',
                            url: url
                        }
                    });
                } else {
                    flog("Share cancelled...");
                }
            });
        });
    }

    $(function () {
        if (window.fbInitDone === null || typeof window.fbInitDone === 'undefined') {
            window.fbInitDone = [];
        }

        if (w.fbAsyncInitDone) {
            initFacebookShare();
        } else {
            window.fbInitDone.push(initFacebookShare);
        }
    });
})(window, jQuery);