(function($){
    $(document).ready(function(){
        if($('.post-notify-porlet').length > 0) {
            pageInitFunctions.push(function () {
                initNotifications();
                initWsNotifications();
            });

            function initNotifications() {
                $(".notifications").click(function (e) {
                    var link = $(e.target).closest("a");
                    if (link.hasClass("loaded")) {
                        return;
                    }
                    loadNotifications($("#notificationsContainer"));
                });
                flog("a clicks", $(".notifications"));
                $("#notificationsContainer").on("click", "a", function (e) {
                    e.preventDefault();
                    var link = $(e.target).closest("a");
                    var href = link.attr("href");
                    var id = link.data("notifId");
                    $.ajax({
                        type: "GET",
                        url: "/notifs?ack=" + id,
                        dataType: 'json',
                        success: function (data) {
                            window.location = href;
                        },
                        error: function (resp) {
                            flog('loadNotifications error', resp);
                        }
                    });
                });
            }

            function initWsNotifications() {
                log('initNotifications');
                $('.notifications').notifications();
            }

            function loadNotifications(cont) {
                cont.find(".notif").remove();
                $.ajax({
                    type: "GET",
                    url: "/notifs",
                    dataType: 'json',
                    success: function (data) {
                        flog('loadNotifications response', data, data.hits.hits.length);
                        cont.find('.numNotifs').text(data.hits.hits.length);
                        for (var i = 0; i < data.hits.hits.length; i++) {
                            var hit = data.hits.hits[i];
                            var id = hit._id;
                            var names = hit.fields["posts.user.nickName"];
                            var what;
                            if (hit.fields.contentTitle) {
                                what = hit.fields.contentTitle[0];
                            } else {
                                what = "no title";
                            }
                            var who;
                            if (names.length > 1) {
                                who = names[0] + " and " + (names.length - 1) + " others";
                            } else {
                                who = names[0];
                            }
                            var message = who + " commented on " + what;
                            var li = $("<li class='notif'>");
                            var link = $("<a>");
                            link.data("notifId", id);
                            li.append(link);
                            if (hit.fields.contentHref) {
                                link.attr("href", hit.fields.contentHref[0]);
                            }
                            link.text(message);
                            cont.append(li);
                        }
                    },
                    error: function (resp) {
                        flog('loadNotifications error', resp);
                    }
                });
            }
        }
    });

})(jQuery);


