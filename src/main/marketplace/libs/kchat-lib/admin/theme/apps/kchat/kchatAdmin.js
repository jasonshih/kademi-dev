(function ($) {
    var KChatAdmin = function (element, options) {
        var self = this;
        self.$elem = $(element);
        self.$orgId = self.$elem.data('cid').toString();
        self.$maxFileSize = 1000000 * 10; // 10 MB
        
        // Create a logger
        if (typeof window.flog === 'function') {
            self.$log = window.flog.bind(self, '[ KChat Admin ] ::');
        } else if (window.console && typeof console.log === 'function') {
            self.$log = window.console.log.bind(self, '[ KChat Admin ] ::');
        } else {
            self.$log = function () {
            };
        }
        
        // Check if WebSockets is supported, And only init if it is...
        self.$supportsWebSockets = 'WebSocket' in window || 'MozWebSocket' in window;
        if (self.$supportsWebSockets) {
            self.$WebSocket = window.WebSocket || window.MozWebSocket;
        } else {
            self.$log('Error: WebSocket not supported...');
        }
        
        // Init Handlebars Helpers
        Handlebars.registerHelper('_ifImage', function (contentType, options) {
            contentType = Handlebars.Utils.escapeExpression(contentType);
            
            if (contentType.contains('image/')) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        });
        
        Handlebars.registerHelper('_getExtension', function (fileName) {
            if (typeof fileName === 'string' && fileName.lastIndexOf('.') > -1) {
                return fileName.substring(fileName.lastIndexOf('.'));
            } else {
                return '';
            }
        });
        
        // Init Handlebars templates
        var kchat_user_templ = self.$elem.find('.kchat-user-template').html();
        self.$kchat_user_templ = Handlebars.compile(kchat_user_templ);
        
        var kchat_msg_templ = self.$elem.find('.kchat-msg-template').html();
        self.$kchat_msg_templ = Handlebars.compile(kchat_msg_templ);
        
        var kchatadmin_msg_templ = self.$elem.find('.kchatadmin-msg-template').html();
        self.$kchatadmin_msg_templ = Handlebars.compile(kchatadmin_msg_templ);
        
        var kchat_user_chatlist_template = self.$elem.find('.kchat-user-chatlist-template').html();
        self.$kchat_user_chatlist_templ = Handlebars.compile(kchat_user_chatlist_template);
        
        // Init sidebar
        var navBar = $('.navbar-tools .navbar-right');
        if (navBar.find('li.fuse-header-item a.sb-toggle').length === 0) {
            navBar.append(
                '<li class="fuse-header-item">' +
                '    <a class="kchat-toggle" href="#"><i class="fa fa-outdent"></i><i class="fa fa-indent"></i></a>' +
                '</li>'
            );
            self.toggle = navBar.find('.kchat-toggle');
        }
        self.sidebar = $('#page-sidebar');
        
        self.$b64ContentId = Base64.encode(self.$orgId);
        
        self.$port = parseInt(window.location.port || 80) + 1;
        self.$proto = 'ws://';
        if (window.location.protocol === 'https:') {
            self.$proto = 'wss://';
            self.$port = parseInt(window.location.port || 443) + 1;
        }
        
        self.$wsUrl = self.$proto + window.location.hostname + ':' + self.$port + '/ws/' + window.location.hostname + '/kchatAdmin/' + self.$b64ContentId;
        
        // Register Send btn
        self.$elem.on('click', '.btn-send-msg', function (e) {
            e.preventDefault();
            
            var btn = $(this);
            var d = btn.closest('.discussion');
            var inp = d.find('.kchat-msg-input');
            
            var msg = inp.val();
            var visitorId = d.data('visitorid');
            
            self.$log(btn, d, inp, msg, visitorId);
            
            var d = {
                action: "msg",
                visitorId: visitorId,
                message: msg
            };
            
            self._kchatSend(d);
            
            inp.val('');
            
            var time = new moment();
            var c = {
                time: time.format('hh:mm A'),
                message: msg
            };
            var html = self.$kchatadmin_msg_templ(c);
            self._getMsgList(visitorId).append(html);
        });
        
        self.$elem.on('keypress', '.kchat-msg-input', function (e) {
            if (e.which === 13) {//Enter key pressed
                var btn = $(this);
                var d = btn.closest('.discussion');
                d.find('.btn-send-msg').click();
            }
        });
        
        // Check if formData is supported
        self.$supportFormData = 'FormData' in window;
        
        if (self.$supportFormData) {
            
            // Init support for image pasting
            self.$elem.on('paste', '.discussion', function (e) {
                var elem = $(this);
                var visitorId = elem.closest('.discussion').data('visitorid');
                
                self.$log('On Paste: ', visitorId, this, e);
                
                var items = (e.clipboardData || e.originalEvent.clipboardData).items;
                
                for (var index in items) {
                    var item = items[index];
                    if (item.kind === 'file') {
                        var blob = item.getAsFile();
                        
                        self._kchatUploadFile(visitorId, blob);
                    }
                }
            });
            
            // Init Drag-Drop file uploader
            if ('draggable' in self.$elem[0] || ('ondragstart' in self.$elem[0] && 'ondrop' in self.$elem[0])) {
                var elm = self.$elem;
                
                elm.on('drag dragstart dragend dragover dragenter dragleave drop', '.discussion', function (e) {
                    self.$log('Drag Event', e);
                    e.preventDefault();
                    e.stopPropagation();
                }).on('dragstart drag dragover dragenter', '.discussion', function (e) {
                    self.$log('Drag Event 1', e);
                    elm.addClass('is-dragover');
                }).on('dragleave dragend drop', '.discussion', function (e) {
                    self.$log('Drag Event 2', e);
                    elm.removeClass('is-dragover');
                }).on('drop', '.discussion', function (e) {
                    elm.removeClass('is-dragover');
                    var visitorid = $(e.currentTarget).closest('.discussion').data('visitorid');
                    
                    flog('Dropped', e, elm, visitorid);
                    var droppedFiles = e.originalEvent.dataTransfer.files;
                    if (droppedFiles && droppedFiles.length > 0) {
                        self._kchatUploadFile(visitorid, droppedFiles[0]);
                    }
                });
            }
        }
        
        // Init
        self._initQuickSideBar();
        self._kchatInitNotificationSound();
        self._kchatInitDesktopNotifications();
        self._kchatConnectWs();
    };
    
    KChatAdmin.prototype = {
        isConnected: function () {
            var self = this;
            
            if (self.$ws !== null && typeof self.$ws !== 'undefined' && self.$ws instanceof self.$WebSocket) {
                return self.$ws.readyState === self.$ws.OPEN;
            }
            
            return false;
        },
        _kchatStartCheckWS: function () {
            var self = this;
            
            if (self.$pollTimer) {
                self.$pollTimer = window.clearTimeout(self.$pollTimer);
            }
            if (self.$timeoutTimer) {
                self.$timeoutTimer = window.clearTimeout(self.$timeoutTimer);
            }
            
            self.$pollTimer = window.setTimeout(self._kchatCheckWS.bind(self), 5000);
        },
        _kchatCheckWS: function () {
            var self = this;
            
            if (self.$pollTimer) {
                self.$pollTimer = window.clearTimeout(self.$pollTimer);
            }
            
            if (self.isConnected()) {
                self._kchatSend({action: 'ping'});
            }
            
            if (self.$timeoutTimer) {
                self.$timeoutTimer = window.clearTimeout(self.$timeoutTimer);
            }
            
            self.$timeoutTimer = window.setTimeout(self._kchatWSTimeout.bind(self), 4000);
        },
        _kchatWSTimeout: function () {
            var self = this;
            
            self.$log('Connection timed out, Attempt to reconnect...');
            
            self._kchatConnectWs();
        },
        _kchatSend: function (d) {
            var self = this;
            
            if (self.isConnected()) {
                var msg;
                if (typeof d === 'string') {
                    msg = d;
                } else {
                    msg = JSON.stringify(d);
                }
                
                self.$ws.send(msg);
            } else {
                self.$log('Not Connected, So Queueing message to be sent...');
            }
        },
        _kchatConnectWs: function () {
            var self = this;
            self.$wsConnecting = true;
            
            self.$log('Connecting to ' + self.$wsUrl);
            
            if (self.$ws !== null && typeof self.$ws !== 'undefined') {
                try {
                    self.ws.close();
                } catch (err) {
                }
            }
            
            try {
                self.$ws = new self.$WebSocket(self.$wsUrl);
                self.$ws.onmessage = self._kchatOnMessage.bind(self);
                self.$ws.onclose = self._kchatOnClose.bind(self);
                self.$ws.onopen = self._kchatOnOpen.bind(self);
                self.$ws.onerror = self._kchatOnError.bind(self);
            } catch (err) {
                self.$log('Error Connecting to ' + self.$wsUrl);
            }
            
            self._kchatStartCheckWS();
            self.$wsConnecting = false;
        },
        _kchatOnMessage: function (evt) {
            var self = this;
            self._kchatStartCheckWS();
            
            var c = $.parseJSON(evt.data);
            self._getMsgList(c.visitorId).parent().perfectScrollbar({
                wheelSpeed: 1,
                minScrollbarLength: 20,
                suppressScrollX: true
            });
            
            if (c.action === "connected") {
                if ($('#user-' + c.visitorId).length > 0) {
                    self.$log('user ' + c.visitorId + ' is already connected');
                    return;
                }
                
                var time = new moment(c.timestamp);
                
                c.time = time.format('hh:mm A');
                
                if (c.profile.userId > 0) {
                    c.profilePic = '/manageUsers/' + c.profile.userId + '/pic';
                } else {
                    c.profilePic = "/theme/apps/user/profile.png";
                }
                
                var html = self.$kchat_user_templ(c);
                
                self.sidebar.find('.media-list').append(html);
                
                self.sidebar.find('.user-chat').append(self.$kchat_user_chatlist_templ(c));
            } else if (c.action === "disconnected") {
                self.sidebar.find('.media-list').find('#user-' + c.visitorId).remove();
                self.sidebar.find('.user-chat').find('#chat-' + c.visitorId).remove();
            } else if (c.action === "msg") {
                var time = new moment(c.chatMessage.timestamp);
                
                c.chatMessage.time = time.format('hh:mm A');
                
                c.chatMessage.profilePic = "/theme/apps/user/profile.png";
                
                var html = self.$kchat_msg_templ(c.chatMessage);
                
                self._getMsgList(c.visitorId).append(html);
                
                self._newMessage(c.chatMessage);
            } else if (c.action === 'clients') {
                self.sidebar.find('.media-list').empty();
                
                for (var i = 0; i < c.clients.length; i++) {
                    if ($('#user-' + c.clients[i].visitorId).length > 0) {
                        self.$log('user ' + c.clients[i].visitorId + ' is already connected');
                    } else {
                        if (c.clients[i].profile.userId > 0) {
                            c.clients[i].profilePic = '/manageUsers/' + c.clients[i].profile.userId + '/pic';
                        } else {
                            c.clients[i].profilePic = "/theme/apps/user/profile.png";
                        }
                        
                        var html = self.$kchat_user_templ(c.clients[i]);
                        
                        self.sidebar.find('.media-list').append(html);
                        
                        self.sidebar.find('.user-chat').append(self.$kchat_user_chatlist_templ(c.clients[i]));
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
                        
                        if (self.$elem.find('[data-messageid=' + cm.id + ']').length < 1) {
                            var time = new moment(cm.timestamp);
                            cm.time = time.format('hh:mm A');
                            cm.profilePic = "/theme/apps/user/profile.png";
                            
                            var html = cm.fromAdmin ? self.$kchatadmin_msg_templ(cm) : self.$kchat_msg_templ(cm);
                            self._getMsgList(c.visitorId).append(html);
                        }
                    }
                    
                    self._sortChatList(c.visitorId);
                }
            }
            
            self._kchatStartCheckWS();
        },
        _getMsgList: function (visitorId) {
            var self = this;
            
            return self.sidebar.find('.user-chat').find('#chat-' + visitorId).find('.kchat-msg-list');
        },
        _kchatOnClose: function () {
            var self = this;
            
            if (!self.$wsConnecting) {
                self.$log('WS Connection Closed, Re-attempt soon...');
                
                self._kchatStartCheckWS();
            }
        },
        _kchatOnOpen: function () {
            var self = this;
            
            self.$log('WS Connection Opened...');
            
            // Check history
            self.$elem.show();
        },
        _kchatOnError: function () {
            var self = this;
            
            if (!self.$wsConnecting) {
                self.$log('Error connecting to WS, Re-attempt soon...');
                
                self._kchatStartCheckWS();
            }
        },
        _kchatUploadFile: function (visitorId, file) {
            var self = this;
            
            var chatWrapper = self.$elem.find('#chat-' + visitorId);
            
            if (file.size > self.$maxFileSize) {
                chatWrapper.find('.kchat-fileUpload-title').text('File too large to upload');
                chatWrapper.find('.progress').hide();
                chatWrapper.find('.kchat-fileUpload-wrapper').show();
            } else {
                chatWrapper.find('.kchat-fileUpload-title').text('Uploading ' + file.name + '...');
                chatWrapper.find('.progress').show();
                chatWrapper.find('.kchat-fileUpload-wrapper').show();
                
                var fd = new FormData();
                
                fd.append('visitorId', visitorId);
                fd.append('file', file, file.name);
                
                $.ajax({
                    type: 'POST',
                    url: '/kchatAdmin',
                    dataType: 'JSON',
                    success: function (data, textStatus, jqXHR) {
                        flog('success', data);
                        
                        if (data.status) {
                            var html = self.$kchatadmin_msg_templ(data.data);
                            self._getMsgList(visitorId).append(html);
                            chatWrapper.find('.kchat-fileUpload-wrapper').hide();
                        } else {
                            chatWrapper.find('.kchat-fileUpload-title').text('Error uploading file: ' + (data.messages || ''));
                            chatWrapper.find('.progress').hide();
                            chatWrapper.find('.kchat-fileUpload-wrapper').show();
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        chatWrapper.find('.kchat-fileUpload-title').text('Error uploading file');
                        chatWrapper.find('.progress').hide();
                        chatWrapper.find('.kchat-fileUpload-wrapper').show();
                    },
                    processData: false,
                    contentType: false,
                    beforeSend: function (xhr, options) {
                        options.data = fd;
                        if (fd.fake) {
                            xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + fd.boundary);
                            // with fake FormData object, we must use sendAsBinary
                            xhr.send = function (data) {
                                xhr.sendAsBinary(data.toString());
                            };
                        }
                    }
                });
            }
        },
        _newMessage: function (cm) {
            var self = this;
            
            var isWindowHidden = document.hidden;
            
            var isChatHidden = isWindowHidden || true; // Need to check if the window is open as well
            
            if (isWindowHidden) {
                // Play Sound
                if (self.$notification_audio !== null && self.$notification_audio instanceof Audio) {
                    if (self.$notification_audio.paused) {
                        self.$notification_audio.currentTime = 0;
                        self.$notification_audio.play();
                    } else {
                        self.$notification_audio.pause();
                        self.$notification_audio.currentTime = 0;
                        self.$notification_audio.play();
                    }
                }
            }
            
            if (isChatHidden) {
                // Show Desktop Notification
                if (self.$supportNotification) {
                    var title = 'New Message from ' + (cm.profile.name || cm.profile.userName || cm.profile.email || cm.profile.userId);
                    var body = cm.message || '';
                    var n = new Notification(title, {
                        body: body
                    });
                    n.onclick = function () {
                        n.close();
                        window.focus();
                        
                        $(document.body).addClass('kchat-opened');
                        
                        $('#user-' + cm.visitorId + ' a').click();
                    };
                }
            }
        },
        _kchatInitNotificationSound: function () {
            var self = this;
            
            var supportsAudioObj = 'Audio' in window;
            
            if (supportsAudioObj) {
                try {
                    self.$notification_audio = new Audio('/theme/apps/kchat/notification.mp3');
                } catch (err) {
                    self.$log('KChat: Failed to init notification sound', err);
                    self.$notification_audio = null;
                }
            } else {
            
            }
        },
        _kchatInitDesktopNotifications: function () {
            var self = this;
            
            if ('Notification' in window && Notification.permission !== 'denied') {
                Notification
                    .requestPermission()
                    .then(function (result) {
                        self.$supportNotification = result === 'granted';
                    });
            } else {
                self.$supportNotification = false;
            }
        },
        _initQuickSideBar: function () {
            var self = this;
            
            self.toggle.on('click', function () {
                $(document.body).toggleClass('kchat-opened');
            });
            
            self.sidebar.on('click', '.media a', function (e) {
                e.preventDefault();
                
                var btn = $(this);
                var href = btn.attr('href');
                
                var discussion = btn.closest('.tab-pane').find('.user-chat .discussion');
                discussion.hide();
                
                btn.closest('.tab-pane').find('#chat-' + href).show();
                
                self.sidebar.find('btn-send-msg').data('visitorid', href);
                self.sidebar.addClass('showed-message');
                
                self._kchatSend({action: 'history', visitorId: href});
            });
            
            self.sidebar.find('.sidebar-back').on('click', function (e) {
                e.preventDefault();
                
                self.sidebar.removeClass('showed-message');
            });
            
            self.sidebar.find('.users-list').perfectScrollbar({
                wheelSpeed: 1,
                minScrollbarLength: 20,
                suppressScrollX: true
            });
        },
        _sortChatList: function (visitorId) {
            var self = this;
            
            var ol = self._getMsgList(visitorId);
            
            var chats = ol.find('li');
            
            chats.sort(function (a, b) {
                var aVal = $(a).data('timestamp');
                var bVal = $(b).data('timestamp');
                
                var result = (aVal < bVal) ? -1 : (aVal > bVal) ? 1 : 0;
                return result;
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
            var self = $(this),
                data = self.data('kademi_kchatAdmin');
            if (!data)
                self.data('kademi_kchatAdmin', (data = new KChatAdmin(this, options)));
            if (typeof options === 'string')
                return data[options]();
        });
    };
    
    // Auto Init windows...
    $(function () {
        $('.kchat-admin-container').KChatAdmin();
    });
})(jQuery);