(function ($) {

    var usersMap = {}; // keyed on userId, returns fullName
    var itemsMap = {}; // keyed on path, returns itemTitle

    var methods = {
        init: function (options) {
            var config = $.extend({
                "streamHref": "/stream/",
                "templateSource": $("#entry-template").html()
            }, options);

            log("init stream");

            streamTemplate = Handlebars.compile(config.templateSource);

            Handlebars.registerHelper('dateFromLong', function (millis) {
                if (millis) {
                    if (Array.isArray(millis)) {
                        millis = millis[0];
                    }
                    var date = new Date(millis);
                    return date.toISOString();

                } else {
                    return "";
                }
            });
            Handlebars.registerHelper('itemHref', function () {
                if (this.fields && this.fields.path) {
                    return this.fields.path[0];
                }
                return "";
            });
            Handlebars.registerHelper('lowerCase', function (s) {
                if (s) {
                    if (Array.isArray(s)) {
                        s = s[0];
                    }
                    return s.toLowerCase();
                }
                return "";
            });
            Handlebars.registerHelper('itemId', function () {
                return this["_id"];
            });
            Handlebars.registerHelper('itemTypeIcon', function (itemType) {
                if (itemType) {
                    itemType = itemType[0];
                    return "fa fa-" + itemType;
                }
                return "fa fa-info";
            });
            Handlebars.registerHelper('fullName', function (userName) {
                if (usersMap[userName]) {
                    return usersMap[userName].fullName;
                }
                return "";
            });
            Handlebars.registerHelper('userId', function (userName) {
                if (usersMap[userName]) {
                    return usersMap[userName].userId;
                }
                return "";
            });
            Handlebars.registerHelper('itemTitle', function (path) {
                if (itemsMap[path]) {
                    return itemsMap[path].itemTitle;
                } else {
                    flog("Couldnt find", path, " in ", itemsMap);
                    return path;
                }
            });

            this.data("streamConfig", config);
        },
        loadAggregated: function (streamHref) {
            flog("loadAggregated: load stream", this);
            var config = this.data("streamConfig");
            var container = this;
            var href = config.streamHref;
            if (streamHref) {
                href = streamHref;
            }
            $.ajax({
                type: 'GET',
                url: href + "?size=0",
                dataType: 'json',
                success: function (resp) {
                    flog("stream: ", resp);
                    if (resp.aggregations) {

                        $.each(resp.aggregations.userAggr.buckets, function (i, n) {
                            var item = n.user.hits.hits[0].fields;
                            if (item) {
                                usersMap[n.key] = {};
                                if (item.fullName) {
                                    usersMap[n.key].fullName = item.fullName;
                                }
                                if (item.userId) {
                                    usersMap[n.key].userId = item.userId[0]
                                }
                            }
                        });

                        $.each(resp.aggregations.pathAggr.buckets, function (i, n) {
                            //flog("itemtitle", n);
                            var item = n.itemTitle.hits.hits[0].fields;

                            itemsMap[n.key] = {};
                            if (item && item.itemTitle) {
                                itemsMap[n.key].itemTitle = item.itemTitle;
                            }
                        });

                        var html = streamTemplate(resp);
                        flog("html", html);
                        container.html(html);
                        $(".timeago", streamBody).timeago();
                    } else {
                        container.html("<p>No stream activity yet</p>");
                    }

                },
                error: function (resp) {
                    flog('error', resp);
                    Msg.error('err: couldnt load page data');
                }
            });
        },
        load: function (streamHref) {
            flog("load: load stream", this);
            var config = this.data("streamConfig");
            var container = this;
            var href = config.streamHref;
            if (streamHref) {
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
                    $(".timeago", streamBody).timeago();
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


