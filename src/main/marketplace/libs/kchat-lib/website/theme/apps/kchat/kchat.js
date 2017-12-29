(function ($) {
    var KChat = function (element, options) {
        var $this = this;
        $this.$elem = $(element);
        $this.$maxFileSize = 1000000 * 10; // 10 MB

        // Create a logger
        if (typeof window.flog === 'function') {
            $this.$log = window.flog.bind($this, '[ KChat ] ::');
        } else if (window.console && typeof console.log === 'function') {
            $this.$log = window.console.log.bind($this, '[ KChat ] ::');
        } else {
            $this.$log = function () {};
        }

        // Check if WebSockets is supported, And only init if it is...
        $this.$supportsWebSockets = 'WebSocket' in window || 'MozWebSocket' in window;
        if ($this.$supportsWebSockets) {
            $this.$WebSocket = window.WebSocket || window.MozWebSocket;
        } else {
            $this.$log('Error: WebSocket not supported...');

            $this.$elem.hide();
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

        // Init Handlebars Templates
        var msgr_templ = $this.$elem.find('.kchat-msgr-template').html();
        $this.$msgr = Handlebars.compile(msgr_templ);

        var msgl_templ = $this.$elem.find('.kchat-msgl-template').html();
        $this.$msgl = Handlebars.compile(msgl_templ);

        // Register send button listener
        $this.$elem.on('click', '[data-action=kchat-send]', function (e) {
            e.preventDefault();

            var inp = $this.$elem.find('.kchat-msg-input');
            var value = inp.val().trim();

            $this.sendMsg(value);

            inp.val('');
        });

        $this.$elem.on('keypress', '.kchat-msg-input', function (e) {
            if (e.which === 13) { // Enter key pressed
                var inp = $this.$elem.find('.kchat-msg-input');
                var value = inp.val().trim();
                $this.sendMsg(value);
                inp.val('');
            }
        });
        $this.$elem.find('#kchat-accordion-collapse').on('shown.bs.collapse', function () {
            var panel = $this.$elem.find('.panel-body');
            panel.scrollTop(panel.find('ul').height());

            $this.$log('Scroll to the top!!', $this, panel);
        });

        // Check if formData is supported
        $this.$supportFormData = 'FormData' in window;

        if ($this.$supportFormData) {

            // Init support for image pasting
            $this.$elem.on('paste', function (e) {
                $this.$log('On Paste: ', this, e);

                var items = (e.clipboardData || e.originalEvent.clipboardData).items;
                console.log(JSON.stringify(items));

                for (var index in items) {
                    var item = items[index];
                    if (item.kind === 'file') {
                        var blob = item.getAsFile();

                        $this._kchatUploadFile(blob);
                    }
                }
            });

            // Init Drag-Drop file uploader
            if ('draggable' in $this.$elem[0] || ('ondragstart' in $this.$elem[0] && 'ondrop' in $this.$elem[0])) {
                var elm = $this.$elem.find('#kchat-accordion-collapse .panel-body');

                elm.on('drag dragstart dragend dragover dragenter dragleave drop', function (e) {
                    $this.$log('Drag Event', e);
                    e.preventDefault();
                    e.stopPropagation();
                }).on('dragstart drag dragover dragenter', function (e) {
                    $this.$log('Drag Event 1', e);
                    elm.addClass('is-dragover');
                }).on('dragleave dragend drop', function (e) {
                    $this.$log('Drag Event 2', e);
                    elm.removeClass('is-dragover');
                }).on('drop', function (e) {
                    elm.removeClass('is-dragover');
                    var droppedFiles = e.originalEvent.dataTransfer.files;
                    if (droppedFiles && droppedFiles.length > 0) {
                        $this._kchatUploadFile(droppedFiles[0]);
                    }
                });
            }
        }

        // Init Websockets URL
        $this.$cid = $this.$elem.data('cid');
        $this.$b64ContentId = Base64.encode($this.$cid.toString());
        $this.$port = parseInt(window.location.port || 80) + 1;
        $this.$proto = 'ws://';
        if (window.location.protocol === 'https:') {
            $this.$proto = 'wss://';
            $this.$port = parseInt(window.location.port || 443) + 1;
        }
        $this.$wsUrl = $this.$proto + window.location.hostname + ':' + $this.$port + '/ws/' + window.location.hostname + '/kchat/' + $this.$b64ContentId;

        // Start it
        if ($this.$supportsWebSockets) {
            $this._kchatConnectWs();
        }
    };

    KChat.prototype = {
        show: function () {
            var $this = this;

            $this.$elem.find('#kchat-accordion-collapse').collapse('show');
        },
        hide: function () {
            var $this = this;

            $this.$elem.find('#kchat-accordion-collapse').collapse('hide');
        },
        toggle: function () {
            var $this = this;

            $this.$elem.find('#kchat-accordion-collapse').collapse('toggle');
        },
        sendMsg: function (msg) {
            var $this = this;

            var c = {
                action: "msg",
                message: msg
            };

            $this._kchatSend(c);

            c.timestamp = (new moment()).toISOString();
            c.profile = {
                name: "Me"
            };
            var html = $.parseHTML($this.$msgr(c));

            $(html).find('.timeago').timeago();
            $this.$elem.find('.kchat-msg-list').append($(html));
            var panel = $this.$elem.find('.panel-body');
            panel.scrollTop(panel.find('ul').height());
        },
        isConnected: function () {
            var $this = this;

            if ($this.$ws !== null && typeof $this.$ws !== 'undefined' && $this.$ws instanceof $this.$WebSocket) {
                return $this.$ws.readyState === $this.$ws.OPEN;
            }

            return false;
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
        _kchatWSTimeout: function () {
            var $this = this;

            $this.$log('Connection timed out, Attempt to reconnect...');

            $this._kchatConnectWs();
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
        _kchatOnMessage: function (evt) {
            var $this = this;

            var c = $.parseJSON(evt.data);
            if (c.action === 'msg') {
                $this._kchatStartCheckWS();

                $this._processMessage.call($this, c.chatMessage);

                $this._kchatStartCheckWS();
            } else if (c.action === 'history') {
                $this._kchatStartCheckWS();

                if (c.data) {
                    c.data.sort(function (a, b) {
                        var result = (a['timestamp'] < b['timestamp']) ? -1 : (a['timestamp'] > b['timestamp']) ? 1 : 0;
                        return result * 1;
                    });

                    for (var i = 0; i < c.data.length; i++) {
                        var cm = c.data[i];

                        $this._processMessage.call($this, cm);
                    }

                    $this._sortChatList();
                }

                $this._kchatStartCheckWS();
            } else if (c.action === 'pong') {
                $this._kchatStartCheckWS();
            }
        },
        _processMessage: function (cm) {
            var $this = this;

            if ($this.$elem.find('[data-messageid=' + cm.id + ']').length < 1) {
                var html = $.parseHTML((cm.fromAdmin ? $this.$msgl(cm) : $this.$msgr(cm)));
                $(html).find('.timeago').timeago();
                $this.$elem.find('.kchat-msg-list').append($(html));
                var panel = $this.$elem.find('.panel-body');
                panel.scrollTop(panel.find('ul').height());
            }
        },
        _sortChatList: function () {
            var $this = this;

            var chats = $this.$elem.find('li');

            chats.sort(function (a, b) {
                var aVal = $(a).data('timestamp');
                var bVal = $(b).data('timestamp');

                var result = (aVal < bVal) ? -1 : (aVal > bVal) ? 1 : 0;
                return result * 1;
            });

            $this.$elem.find('.kchat-msg-list').empty().append(chats);
        },
        _kchatUploadFile: function (file) {
            var $this = this;

            if (file.size > $this.$maxFileSize) {
                $this.$elem.find('.kchat-fileUpload-title').text('File too large to upload');
                $this.$elem.find('.progress').hide();
                $this.$elem.find('.kchat-fileUpload-wrapper').show();
            } else {
                $this.$elem.find('.kchat-fileUpload-title').text('Uploading ' + file.name + '...');
                $this.$elem.find('.progress').show();
                $this.$elem.find('.kchat-fileUpload-wrapper').show();

                var fd = new FormData();

                fd.append('file', file, file.name);

                $.ajax({
                    type: 'POST',
                    url: '/kchat',
                    dataType: 'JSON',
                    success: function (data, textStatus, jqXHR) {
                        flog('success', data);

                        if (data.status) {
                            $this._processMessage(data.data);
                            $this.$elem.find('.kchat-fileUpload-wrapper').hide();
                        } else {
                            $this.$elem.find('.kchat-fileUpload-title').text('Error uploading file: ' + (data.messages || ''));
                            $this.$elem.find('.progress').hide();
                            $this.$elem.find('.kchat-fileUpload-wrapper').show();
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        $this.$elem.find('.kchat-fileUpload-title').text('Error uploading file');
                        $this.$elem.find('.progress').hide();
                        $this.$elem.find('.kchat-fileUpload-wrapper').show();
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

            $this._kchatSend({action: 'history'});
            $this.$elem.show();
        },
        _kchatOnError: function () {
            var $this = this;

            if (!$this.$wsConnecting) {
                $this.$log('Error connecting to WS, Re-attempt soon...');

                $this._kchatStartCheckWS();
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
        }
    };

    $.fn.KChat = function (options) {
        if (typeof options === 'string' && this.data('kademi_kchat')) {
            var data = this.data('kademi_kchat');
            return data[options]();
        }

        return this.each(function () {
            var $this = $(this),
                    data = $this.data('kademi_kchat');
            if (!data)
                $this.data('kademi_kchat', (data = new KChat(this, options)));
            if (typeof options === 'string')
                return data[options]();
        });
    };

    // Auto Init windows...
    $(function () {
        $('.kchat-chat-container').KChat();
    });
    
})(jQuery);