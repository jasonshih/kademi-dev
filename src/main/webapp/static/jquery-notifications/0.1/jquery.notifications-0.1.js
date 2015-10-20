(function ($) {
    $.fn.notifications = function (options) {

        var isSecure = window.location.protocol === 'https:';
        var protocol = (isSecure ? 'wss' : 'ws');

        var settings = $.extend({
            // These are the defaults.
            url: protocol + '://' + window.location.host + '/comments/' + window.location.host + '/notification/X25vdGlmaWNhdGlvbnM=',
            class: '.badge'
        }, options);

        var a = $(this).find(settings.class);

        var ws = new WebSocket(settings.url);
        ws.onmessage = function (message) {
            var data = JSON.parse(message.data);

            a.text(data.num);
        };

    };
})(jQuery);