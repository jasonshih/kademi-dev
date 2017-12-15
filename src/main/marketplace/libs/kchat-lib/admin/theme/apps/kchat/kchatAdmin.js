//(jQuery)(function () {
//    var notification_audio = null;
//
//    function initSidebarToggle() {
//        var navBar = $('.navbar-tools .navbar-right');
//        if (navBar.find('li.fuse-header-item a.sb-toggle').length === 0) {
//            navBar.append(
//                    '<li class="fuse-header-item">' +
//                    '    <a class="sb-toggle" href="#"><i class="fa fa-outdent"></i></a>' +
//                    '</li>'
//                    );
//        }
//
//    }
//
//    var initKChatWebsocket = function () {
//        var pageSidebar = $('#page-sidebar');
//        var orgId = pageSidebar.data('cid').toString();
//
//        flog('initKChatWebsocket', orgId);
//
//        var b64ContentId = Base64.encode(orgId);
//
//        var port = parseInt(window.location.port || 80) + 1;
//        var proto = 'ws://';
//        if (window.location.protocol === 'https:') {
//            proto = 'wss://';
//            port = parseInt(window.location.port || 443) + 1;
//        }
//
//        var url = window.location.hostname + ':' + port + '/ws/' + window.location.hostname + '/kchatAdmin/' + b64ContentId;
//        flog(url);
//        var kchatSocket = new WebSocket(proto + url);
//
//        kchatSocket.onmessage = function (evt) {
//            flog('Received data', evt);
//
//            var c = $.parseJSON(evt.data);
//
//            if (c.action === "connected") {
//                var templ = $('.kchat-user-template').html();
//
//                var streamItemTemplate = Handlebars.compile(templ);
//
//                if ($('#user-' + c.visitorId).length > 0) {
//                    flog('user ' + c.visitorId + ' is already connected');
//                    return;
//                }
//
//                var time = new moment(c.timestamp);
//
//                c.time = time.format('hh:mm A');
//
//                if (c.profile.userId > 0) {
//                    c.profilePic = '/manageUsers/' + c.profile.userId + '/pic'
//                } else {
//                    c.profilePic = "/theme/apps/user/profile.png";
//                }
//
//                var html = streamItemTemplate(c);
//
//                $('#page-sidebar .media-list').append(html);
//
//                $('#page-sidebar .user-chat').append('<ol id="chat-' + c.visitorId + '" class="discussion sidebar-content"></ol>');
//            } else if (c.action === "disconnected") {
//                $('#page-sidebar .media-list').find('#user-' + c.visitorId).remove();
//                $('#page-sidebar .user-chat').find('#chat-' + c.visitorId).remove();
//            } else if (c.action === "msg") {
//                var templ = $('.kchat-msg-template').html();
//
//                var streamItemTemplate = Handlebars.compile(templ);
//
//                var time = new moment(c.chatMessage.timestamp);
//
//                c.chatMessage.time = time.format('hh:mm A');
//
//                c.chatMessage.profilePic = "/theme/apps/user/profile.png";
//
//                var html = streamItemTemplate(c.chatMessage);
//
//                $('#page-sidebar .user-chat').find('#chat-' + c.visitorId).prepend(html);
//
//                newMessage();
//            } else if (c.action === 'clients') {
//                $('#page-sidebar .media-list').empty();
//
//                for (var i = 0; i < c.clients.length; i++) {
//                    if ($('#user-' + c.clients[i].visitorId).length > 0) {
//                        flog('user ' + c.clients[i].visitorId + ' is already connected');
//                    } else {
//                        var templ = $('.kchat-user-template').html();
//
//                        var streamItemTemplate = Handlebars.compile(templ);
//
//                        if (c.clients[i].profile.userId > 0) {
//                            c.clients[i].profilePic = '/manageUsers/' + c.clients[i].profile.userId + '/pic'
//                        } else {
//                            c.clients[i].profilePic = "/theme/apps/user/profile.png";
//                        }
//
//                        var html = streamItemTemplate(c.clients[i]);
//
//                        $('#page-sidebar .media-list').append(html);
//
//                        $('#page-sidebar .user-chat').append('<ol id="chat-' + c.clients[i].visitorId + '" class="discussion sidebar-content"></ol>');
//                    }
//                }
//            }
//        };
//
//        $('#page-sidebar').on('click', '.btn-send-msg', function (e) {
//            e.preventDefault();
//
//            var btn = $(this);
//            var inp = $('#page-sidebar .kchat-msg-input');
//            var msg = inp.val();
//            var visitorId = btn.data('visitorid');
//
//            var d = {
//                action: "msg",
//                visitorId: visitorId,
//                message: msg
//            };
//
//            kchatSocket.send(JSON.stringify(d));
//
//            inp.val('');
//
//            var templ = $('.kchatadmin-msg-template').html();
//            var streamItemTemplate = Handlebars.compile(templ);
//            var time = new moment();
//            var c = {
//                time: time.format('hh:mm A'),
//                msg: msg
//            };
//            var html = streamItemTemplate(c);
//            $('#page-sidebar .user-chat').find('#chat-' + visitorId).prepend(html);
//        });
//
//        $('#page-sidebar').on('keypress', '.kchat-msg-input', function (e) {
//            if (e.which == 13) {//Enter key pressed
//                $('#page-sidebar').find('.btn-send-msg').click();
//            }
//        });
//    };
//
//    //function to open quick sidebar
//    var initQuickSideBar = function () {
//        $(".sb-toggle").on("click", function (e) {
//            if ($(this).hasClass("open")) {
//                $(this).not(".sidebar-toggler ").find(".fa-indent").removeClass("fa-indent").addClass("fa-outdent");
//                $(".sb-toggle").removeClass("open");
//                $("#page-sidebar").css({
//                    right: -$("#page-sidebar").outerWidth()
//                });
//            } else {
//                $(this).not(".sidebar-toggler ").find(".fa-outdent").removeClass("fa-outdent").addClass("fa-indent");
//                $(".sb-toggle").addClass("open");
//                $("#page-sidebar").css({
//                    right: 0
//                });
//            }
//
//            e.preventDefault();
//        });
//        $("#page-sidebar .media-list").on("click", '.media a', function (e) {
//            e.preventDefault();
//
//            var btn = $(this);
//            var href = btn.attr('href');
//
//            var discussion = btn.closest('.tab-pane').find('.user-chat .discussion');
//            discussion.hide();
//
//            btn.closest('.tab-pane').find('#chat-' + href).show();
//
//            $('#page-sidebar .btn-send-msg').data('visitorid', href);
//
//            //user-chat-form
//            btn.closest(".tab-pane").css({
//                right: $("#page-sidebar").outerWidth()
//            });
//        });
//
//        $("#page-sidebar .sidebar-back").on("click", function (e) {
//            $(this).closest(".tab-pane").css({
//                right: 0
//            });
//            e.preventDefault();
//        });
//        $('#page-sidebar .sidebar-wrapper').perfectScrollbar({
//            wheelSpeed: 1,
//            minScrollbarLength: 20,
//            suppressScrollX: true
//        });
//        $('#sidebar-tab a').on('shown.bs.tab', function (e) {
//            $("#page-sidebar .sidebar-wrapper").perfectScrollbar('update');
//        });
//    };
//
//    function newMessage() {
//        if (notification_audio !== null && notification_audio instanceof Audio) {
//            if (notification_audio.paused) {
//                notification_audio.currentTime = 0;
//                notification_audio.play();
//            } else {
//                notification_audio.pause();
//                notification_audio.currentTime = 0;
//                notification_audio.play();
//            }
//        }
//    }
//
//    function initNotificationSound() {
//        try {
//            notification_audio = new Audio('/theme/apps/kchat/notification.mp3');
//        } catch (err) {
//            flog('KChat: Failed to init notification sound', err);
//            notification_audio = null;
//        }
//    }
//
//    window.sortChatList = function (visitorId) {
//        var container = $('#chat-' + visitorId);
//
//        var chats = container.find('li');
//
//        chats.sort(function (a, b) {
//            var aVal = $(a).data('timestamp');
//            var bVal = $(b).data('timestamp');
//
//            var result = (aVal < bVal) ? -1 : (aVal > bVal) ? 1 : 0;
//            return result * 1;
//        });
//    };
//
//    // Init KChat Admin
//    $(function () {
//        initSidebarToggle();
//        initQuickSideBar();
//        initKChatWebsocket();
//        initNotificationSound();
//    });
//});

(function ($) {
    var KChatAdmin = function (element, options) {
        var $this = this;
        $this.$elem = $(element);
        $this.$orgId = $this.$elem.data('cid').toString();

        // Create a logger
        if (typeof window.flog === 'function') {
            $this.$log = window.flog.bind($this, '[ KChat Admin ] ::');
        } else if (window.console && typeof console.log === 'function') {
            $this.$log = window.console.log.bind($this, '[ KChat Admin ] ::');
        } else {
            $this.$log = function () {};
        }

        // Check if WebSockets is supported, And only init if it is...
        $this.$supportsWebSockets = 'WebSocket' in window || 'MozWebSocket' in window;
        if ($this.$supportsWebSockets) {
            $this.$WebSocket = window.WebSocket || window.MozWebSocket;
        } else {
            $this.$log('Error: WebSocket not supported...');
        }

        // Init Handlebars templates
        var kchat_user_templ = $this.$elem.find('.kchat-user-template').html();
        $this.$kchat_user_templ = Handlebars.compile(kchat_user_templ);

        var kchat_msg_templ = $this.$elem.find('.kchat-msg-template').html();
        $this.$kchat_msg_templ = Handlebars.compile(kchat_msg_templ);

        var kchatadmin_msg_templ = $this.$elem.find('.kchatadmin-msg-template').html();
        $this.$kchatadmin_msg_templ = Handlebars.compile(kchatadmin_msg_templ);

        var kchat_user_chatlist_template = $this.$elem.find('.kchat-user-chatlist-template').html();
        $this.$kchat_user_chatlist_templ = Handlebars.compile(kchat_user_chatlist_template);

        // Init sidebar
        var navBar = $('.navbar-tools .navbar-right');
        if (navBar.find('li.fuse-header-item a.sb-toggle').length === 0) {
            navBar.append(
                    '<li class="fuse-header-item">' +
                    '    <a class="sb-toggle" href="#"><i class="fa fa-outdent"></i></a>' +
                    '</li>'
                    );
        }

        $this.$b64ContentId = Base64.encode($this.$orgId);

        $this.$port = parseInt(window.location.port || 80) + 1;
        $this.$proto = 'ws://';
        if (window.location.protocol === 'https:') {
            $this.$proto = 'wss://';
            $this.$port = parseInt(window.location.port || 443) + 1;
        }

        $this.$wsUrl = $this.$proto + window.location.hostname + ':' + $this.$port + '/ws/' + window.location.hostname + '/kchatAdmin/' + $this.$b64ContentId;

        // Register Send btn
        $this.$elem.on('click', '.btn-send-msg', function (e) {
            e.preventDefault();

            var btn = $(this);
            var d = btn.closest('.discussion');
            var inp = d.find('.kchat-msg-input');

            var msg = inp.val();
            var visitorId = d.data('visitorid');

            $this.$log(btn, d, inp, msg, visitorId);

            var d = {
                action: "msg",
                visitorId: visitorId,
                message: msg
            };

            $this._kchatSend(d);

            inp.val('');

            var time = new moment();
            var c = {
                time: time.format('hh:mm A'),
                message: msg
            };
            var html = $this.$kchatadmin_msg_templ(c);
            $this.$elem.find('.user-chat').find('#chat-' + visitorId).find('.kchat-client-msg-list').prepend(html);
        });

        $this.$elem.on('keypress', '.kchat-msg-input', function (e) {
            if (e.which === 13) {//Enter key pressed
                var btn = $(this);
                var d = btn.closest('.discussion');
                d.find('.btn-send-msg').click();
            }
        });

        // Init
        $this._initQuickSideBar();
        $this._kchatInitNotificationSound();
        $this._kchatInitDesktopNotifications();
        $this._kchatConnectWs();
    };

    KChatAdmin.prototype = {
        isConnected: function () {
            var $this = this;

            if ($this.$ws !== null && typeof $this.$ws !== 'undefined' && $this.$ws instanceof $this.$WebSocket) {
                return $this.$ws.readyState === $this.$ws.OPEN;
            }

            return false;
        },
        _kchatStartCheckWS: function () {
            var $this = this;

            if ($this.$pollTimer) {
                $this.$pollTimer = window.clearTimeout($this.$pollTimer);
            }
            if ($this.$timeoutTimer) {
                $this.$timeoutTimer = window.clearTimeout($this.$timeoutTimer);
            }

            $this.$pollTimer = window.setTimeout($this._kchatCheckWS.bind($this), 5000);
        },
        _kchatCheckWS: function () {
            var $this = this;

            if ($this.$pollTimer) {
                $this.$pollTimer = window.clearTimeout($this.$pollTimer);
            }

            if ($this.isConnected()) {
                $this._kchatSend({action: 'ping'});
            }

            if ($this.$timeoutTimer) {
                $this.$timeoutTimer = window.clearTimeout($this.$timeoutTimer);
            }

            $this.$timeoutTimer = window.setTimeout($this._kchatWSTimeout.bind($this), 4000);
        },
        _kchatWSTimeout: function () {
            var $this = this;

            $this.$log('Connection timed out, Attempt to reconnect...');

            $this._kchatConnectWs();
        },
        _kchatSend: function (d) {
            var $this = this;

            if ($this.isConnected()) {
                var msg;
                if (typeof d === 'string') {
                    msg = d;
                } else {
                    msg = JSON.stringify(d);
                }

                $this.$ws.send(msg);
            } else {
                $this.$log('Not Connected, So Queueing message to be sent...');
            }
        },
        _kchatConnectWs: function () {
            var $this = this;
            $this.$wsConnecting = true;

            $this.$log('Connecting to ' + $this.$wsUrl);

            if ($this.$ws !== null && typeof $this.$ws !== 'undefined') {
                try {
                    $this.ws.close();
                } catch (err) {
                }
            }

            try {
                $this.$ws = new $this.$WebSocket($this.$wsUrl);
                $this.$ws.onmessage = $this._kchatOnMessage.bind($this);
                $this.$ws.onclose = $this._kchatOnClose.bind($this);
                $this.$ws.onopen = $this._kchatOnOpen.bind($this);
                $this.$ws.onerror = $this._kchatOnError.bind($this);
            } catch (err) {
                $this.$log('Error Connecting to ' + $this.$wsUrl);
            }

            $this._kchatStartCheckWS();
            $this.$wsConnecting = false;
        },
        _kchatOnMessage: function (evt) {
            var $this = this;
            flog('Received data', evt);
            $this._kchatStartCheckWS();

            var c = $.parseJSON(evt.data);

            if (c.action === "connected") {
                if ($('#user-' + c.visitorId).length > 0) {
                    $this.$log('user ' + c.visitorId + ' is already connected');
                    return;
                }

                var time = new moment(c.timestamp);

                c.time = time.format('hh:mm A');

                if (c.profile.userId > 0) {
                    c.profilePic = '/manageUsers/' + c.profile.userId + '/pic';
                } else {
                    c.profilePic = "/theme/apps/user/profile.png";
                }

                var html = $this.$kchat_user_templ(c);

                $('#page-sidebar .media-list').append(html);

                $('#page-sidebar .user-chat').append($this.$kchat_user_chatlist_templ(c));
            } else if (c.action === "disconnected") {
                $('#page-sidebar .media-list').find('#user-' + c.visitorId).remove();
                $('#page-sidebar .user-chat').find('#chat-' + c.visitorId).remove();
            } else if (c.action === "msg") {
                var time = new moment(c.chatMessage.timestamp);

                c.chatMessage.time = time.format('hh:mm A');

                c.chatMessage.profilePic = "/theme/apps/user/profile.png";

                var html = $this.$kchat_msg_templ(c.chatMessage);

                $('#page-sidebar .user-chat').find('#chat-' + c.visitorId).find('.kchat-client-msg-list').prepend(html);

                $this._newMessage(c.chatMessage);
            } else if (c.action === 'clients') {
                $('#page-sidebar .media-list').empty();

                for (var i = 0; i < c.clients.length; i++) {
                    if ($('#user-' + c.clients[i].visitorId).length > 0) {
                        flog('user ' + c.clients[i].visitorId + ' is already connected');
                    } else {
                        if (c.clients[i].profile.userId > 0) {
                            c.clients[i].profilePic = '/manageUsers/' + c.clients[i].profile.userId + '/pic';
                        } else {
                            c.clients[i].profilePic = "/theme/apps/user/profile.png";
                        }

                        var html = $this.$kchat_user_templ(c.clients[i]);

                        $('#page-sidebar .media-list').append(html);

                        $('#page-sidebar .user-chat').append($this.$kchat_user_chatlist_templ(c.clients[i]));
                    }
                }
            } else if (c.action === 'history') {
                var data = c.data;

                if (data) {
                    data.sort(function (a, b) {
                        var result = (a['timestamp'] < b['timestamp']) ? -1 : (a['timestamp'] > b['timestamp']) ? 1 : 0;
                        return result * 1;
                    });

                    for (var i = 0; i < data.length; i++) {
                        var cm = data[i];

                        if ($this.$elem.find('[data-messageid=' + cm.id + ']').length < 1) {
                            var time = new moment(cm.timestamp);
                            cm.time = time.format('hh:mm A');
                            cm.profilePic = "/theme/apps/user/profile.png";

                            var html = cm.fromAdmin ? $this.$kchatadmin_msg_templ(cm) : $this.$kchat_msg_templ(cm);
                            $('#page-sidebar .user-chat').find('#chat-' + c.visitorId).find('.kchat-client-msg-list').prepend(html);
                        }
                    }

                    $this._sortChatList(c.visitorId);
                }
            }

            $this._kchatStartCheckWS();
        },
        _kchatOnClose: function () {
            var $this = this;

            if (!$this.$wsConnecting) {
                $this.$log('WS Connection Closed, Re-attempt soon...');

                $this._kchatStartCheckWS();
            }
        },
        _kchatOnOpen: function () {
            var $this = this;

            $this.$log('WS Connection Opened...');

            // Check history
            $this.$elem.show();
        },
        _kchatOnError: function () {
            var $this = this;

            if (!$this.$wsConnecting) {
                $this.$log('Error connecting to WS, Re-attempt soon...');

                $this._kchatStartCheckWS();
            }
        },
        _newMessage: function (cm) {
            var $this = this;

            var isWindowHidden = document.hidden;

            var isChatHidden = isWindowHidden || true; // Need to check if the window is open as well

            if (isWindowHidden) {
                // Play Sound
                if ($this.$notification_audio !== null && $this.$notification_audio instanceof Audio) {
                    if ($this.$notification_audio.paused) {
                        $this.$notification_audio.currentTime = 0;
                        $this.$notification_audio.play();
                    } else {
                        $this.$notification_audio.pause();
                        $this.$notification_audio.currentTime = 0;
                        $this.$notification_audio.play();
                    }
                }
            }

            if (isChatHidden) {
                // Show Desktop Notification
                if ($this.$supportNotification) {
                    var title = 'New Message from ' + (cm.profile.name || cm.profile.userName || cm.profile.email || cm.profile.userId);
                    var body = cm.message || '';
                    var n = new Notification(title, {
                        body: body
                    });
                    n.onclick = function () {
                        flog(arguments);
                        n.close();
                        window.focus();

                        if (!$('li.fuse-header-item a.sb-toggle').hasClass('open')) {
                            $('li.fuse-header-item a.sb-toggle').click();
                        }

                        $('#user-' + cm.visitorId + ' a').click();
                    };
                }
            }
        },
        _kchatInitNotificationSound: function () {
            var $this = this;

            var supportsAudioObj = 'Audio' in window;

            if (supportsAudioObj) {
                try {
                    $this.$notification_audio = new Audio('/theme/apps/kchat/notification.mp3');
                } catch (err) {
                    flog('KChat: Failed to init notification sound', err);
                    $this.$notification_audio = null;
                }
            } else {

            }
        },
        _kchatInitDesktopNotifications: function () {
            var $this = this;

            if ('Notification' in window && Notification.permission !== 'denied') {
                Notification
                        .requestPermission()
                        .then(function (result) {
                            $this.$supportNotification = result === 'granted';
                        });
            } else {
                $this.$supportNotification = false;
            }
        },
        _initQuickSideBar: function () {
            var $this = this;

            $(".sb-toggle").on("click", function (e) {
                if ($(this).hasClass("open")) {
                    $(this).not(".sidebar-toggler ").find(".fa-indent").removeClass("fa-indent").addClass("fa-outdent");
                    $(".sb-toggle").removeClass("open");
                    $("#page-sidebar").css({
                        right: -$("#page-sidebar").outerWidth()
                    });
                    $('.kchat-admin-container').css({right: 0});
                } else {
                    $(this).not(".sidebar-toggler ").find(".fa-outdent").removeClass("fa-outdent").addClass("fa-indent");
                    $(".sb-toggle").addClass("open");
                    $("#page-sidebar").css({
                        right: 0
                    });
                }

                e.preventDefault();
            });
            $("#page-sidebar .media-list").on("click", '.media a', function (e) {
                e.preventDefault();

                var btn = $(this);
                var href = btn.attr('href');

                var discussion = btn.closest('.tab-pane').find('.user-chat .discussion');
                discussion.hide();

                btn.closest('.tab-pane').find('#chat-' + href).show();

                $('#page-sidebar .btn-send-msg').data('visitorid', href);

                //user-chat-form
                btn.closest(".tab-pane").css({
                    right: $("#page-sidebar").outerWidth()
                });

                $this._kchatSend({action: 'history', visitorId: href});
            });

            $("#page-sidebar .sidebar-back").on("click", function (e) {
                $(this).closest(".tab-pane").css({
                    right: 0
                });
                e.preventDefault();
            });
            $('#page-sidebar .sidebar-wrapper').perfectScrollbar({
                wheelSpeed: 1,
                minScrollbarLength: 20,
                suppressScrollX: true
            });
            $('#sidebar-tab a').on('shown.bs.tab', function (e) {
                $("#page-sidebar .sidebar-wrapper").perfectScrollbar('update');
            });
        },
        _sortChatList: function (visitorId) {
            var $this = this;

            var ol = $this.$elem.find('#chat-' + visitorId).find('.kchat-client-msg-list');

            var chats = ol.find('li');

            chats.sort(function (a, b) {
                var aVal = $(a).data('timestamp');
                var bVal = $(b).data('timestamp');

                var result = (aVal < bVal) ? -1 : (aVal > bVal) ? 1 : 0;
                return result * -1;
            });

            ol.empty().append(chats);
        }
    };

    $.fn.KChatAdmin = function (options) {
        if (typeof options === 'string' && this.data('kademi_kchatAdmin')) {
            var data = this.data('kademi_kchatAdmin');
            return data[options]();
        }

        return this.each(function () {
            var $this = $(this),
                    data = $this.data('kademi_kchatAdmin');
            if (!data)
                $this.data('kademi_kchatAdmin', (data = new KChatAdmin(this, options)));
            if (typeof options === 'string')
                return data[options]();
        });
    };

    // Auto Init windows...
    $(function () {
        $('.kchat-admin-container').KChatAdmin();
    });
})(jQuery);