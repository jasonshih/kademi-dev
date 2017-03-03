(function ($, window) {
    function initAllow() {
        $('body').on('click', '.btn-allow', function (e) {
            e.preventDefault();

            $.ajax({
                type: 'POST',
                dataType: 'json',
                data: {
                    allowAuthorization: true
                },
                success: function (resp) {
                    if (resp.status) {
                        Msg.success(resp.messages);
                        flog('Redirecting', resp.nextHref);
                        window.location.replace(resp.nextHref);
                    } else {
                        Msg.error(resp.messages);
                    }
                },
                error: function () {
                    Msg.error('Sorry, there appears to be a problem with the network or server. Please check your internet connection. If you\'re connected ok this might be a glitch in the system.');
                }
            });
        });
    }

    function initDeny() {
        $('body').on('click', '.btn-deny', function (e) {
            e.preventDefault();

            $.ajax({
                type: 'POST',
                dataType: 'json',
                data: {
                    allowAuthorization: false
                },
                success: function (resp) {
                    if (resp.status) {
                        Msg.success(resp.messages);
                        flog('Redirecting', resp.nextHref);
                        window.location.replace(resp.nextHref);
                    } else {
                        Msg.error(resp.messages);
                    }
                },
                error: function () {
                    Msg.error('Sorry, there appears to be a problem with the network or server. Please check your internet connection. If you\'re connected ok this might be a glitch in the system.');
                }
            });
        });
    }

    // Run init Methods
    $(function () {
        initAllow();
        initDeny();
    });
})(jQuery, this);