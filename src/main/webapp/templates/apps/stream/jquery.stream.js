(function ($) {
    var methods = {
        init: function (options) {
            var config = $.extend({
                "streamHref": "/stream",
                "templateSource": $("#entry-template").html()
            }, options);

            log("init stream");

            streamTemplate = Handlebars.compile(config.templateSource);

            Handlebars.registerHelper('dateFromLong', function (millis) {
                if (millis) {
                    var date = new Date(millis[0]);
                    return date.toISOString();
                } else {
                    return "";
                }
            });
            Handlebars.registerHelper('itemHref', function () {
                if (this.fields.path) {
                    return this.fields.path[0];
                }
                return "";
            });
            this.data("streamConfig", config);
        },
        load: function (streamHref) {
            flog("load stream", this);
            var config = this.data("streamConfig");
            var container = this;
            var href = config.streamHref;
            if( streamHref ) {
                href = streamHref;
            }
            $.ajax({
                type: 'GET',
                url: href,
                dataType: 'json',
                success: function (resp) {
                    flog("stream: ", resp);
                    var html = streamTemplate(resp);
                    flog("html", html);
                    container.html(html);
                    $("span.timeago", streamBody).timeago();
                },
                error: function (resp) {
                    flog('error', resp);
                    Msg.error('err: couldnt load page data');
                }
            });
        }
    };

    $.fn.stream = function (method) {
        flog("stream", this);
        if (methods[method]) {
            return methods[ method ].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.stream');
        }
    };
})(jQuery);


