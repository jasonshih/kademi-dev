/*
 * a nice little Websocket wrapper for Kademi that will automaticly reconnect list connections using a few methods including ping/pong requests
 * 
 * Example of use:
 * 
 * var kSocket = new $.KWebsocket({
 * 	url: 'ws://localhost/ws/'
 * 	onmessage: function(evt){
 * 		console.log(evt.data);
 * 	}
 * });
 * 
 * or
 * 
 * var kSocket = new $.KWebsocket({
 *     url: 'ws://localhost/ws/'
 * });
 * kSocket.onmessage = function(evt){
 *     console.log(evt.data);
 * };
 * 
 */

(function ($) {
    var KWebsocket = function (options) {
        var $this = this;

        flog('THIS', this, $this);

        // Ping/Pong variables
        $this._pingMsg = ':::::ping:::::';
        $this._pongMsg = ':::::pong:::::';

        // Create a logger
        if (typeof window.flog === 'function') {
            $this.$log = window.flog.bind($this, '[ KWebsocket ] ::');
        } else if (window.console && typeof console.log === 'function') {
            $this.$log = window.console.log.bind($this, '[ KWebsocket ] ::');
        } else {
            $this.$log = function () {};
        }

        // Check if WebSockets is supported, And only init if it is...
        $this._INTERNAL.$supportsWebSockets = 'WebSocket' in window || 'MozWebSocket' in window;
        if ($this._INTERNAL.$supportsWebSockets) {
            $this._INTERNAL.$WebSocket = window.WebSocket || window.MozWebSocket;
            $this.$log('Websockets is supported');
        } else {
            $this.$log('Error: WebSocket not supported...');
        }

        // Parse options
        if (options) {
            $this.$options = $.extend(true, {}, $this.DEFAULTS, options);
        } else {
            $this.$options = $.extend(true, {}, $this.DEFAULTS);
        }

        // Generate the correct URL
        var url = new URL($this.$options.url || $this.DEFAULTS.url);
        var proto = 'ws://';
        var port = parseInt(window.location.port || 80) + 1;
        if (window.location.protocol === 'https:') {
            proto = 'wss://';
            port = parseInt(window.location.port || 443) + 1;
        }

        url.protocol = proto;
        url.port = port;
        $this.$wsUrl = url.toString();

        if ($this._INTERNAL.$supportsWebSockets) {
            $this._INTERNAL._wsConnect.call($this);
        }
    };

    KWebsocket.prototype = {
        isConnected: function () {
            var $this = this;

            if ($this._INTERNAL.$ws !== null && typeof $this._INTERNAL.$ws !== 'undefined' && $this._INTERNAL.$ws instanceof $this._INTERNAL.$WebSocket) {
                return $this._INTERNAL.$ws.readyState === $this._INTERNAL.$ws.OPEN;
            }

            return false;
        },
        send: function (msg) {
            var $this = this;

            $this._INTERNAL._send.call($this, msg);
        },
        onmessage: function (evt) {},
        onopen: function () {},
        onclose: function () {},
        onerror: function () {},
        _INTERNAL: {
            _onMessage: function (evt) {
                var $this = this;

                if (evt && evt.data && evt.data === $this._pongMsg) {
                    // We got a pong, The connection is still live!
                    $this._INTERNAL._startCheckWS.call($this);
                } else {
                    if (typeof $this.$options.onmessage === 'function') {
                        $this.$options.onmessage.call($this, evt);
                    }
                    if (typeof $this.onmessage === 'function') {
                        $this.onmessage.call($this, evt);
                    }
                }
            },
            _onOpen: function () {
                var $this = this;

                if (typeof $this.$options.onmessage === 'function') {
                    $this.$options.onopen.call($this);
                }
                if (typeof $this.onopen === 'function') {
                    $this.onopen.call($this);
                }
            },
            _onClose: function () {
                var $this = this;

                if (typeof $this.$options.onclose === 'function') {
                    $this.$options.onclose.call($this);
                }
                if (typeof $this.onclose === 'function') {
                    $this.onclose.call($this);
                }
            },
            _onError: function () {
                var $this = this;

                if (typeof $this.$options.onerror === 'function') {
                    $this.$options.onerror.call($this);
                }
                if (typeof $this.onerror === 'function') {
                    $this.onerror.call($this);
                }
            },
            _send: function (msg) {
                var $this = this;

                if (typeof msg === 'string') {
                    $this._INTERNAL.$ws.send(msg);
                } else {
                    $this._INTERNAL.$ws.send(JSON.stringify(msg));
                }
            },
            _startCheckWS: function () {
                var $this = this;

                if ($this._INTERNAL.$pollTimer) {
                    $this._INTERNAL.$pollTimer = window.clearTimeout($this._INTERNAL.$pollTimer);
                }
                if ($this._INTERNAL.$timeoutTimer) {
                    $this._INTERNAL.$timeoutTimer = window.clearTimeout($this._INTERNAL.$timeoutTimer);
                }

                var pollTime = $this.$options.pollTime || 5000;

                $this._INTERNAL.$pollTimer = window.setTimeout($this._INTERNAL._checkWs.bind($this), pollTime);
            },
            _checkWs: function () {
                var $this = this;

                if ($this._INTERNAL.$pollTimer) {
                    $this._INTERNAL.$pollTimer = window.clearTimeout($this._INTERNAL.$pollTimer);
                }

                if ($this.isConnected()) {
                    $this._INTERNAL._send.call($this, $this._pingMsg);
                }

                if ($this._INTERNAL.$timeoutTimer) {
                    $this._INTERNAL.$timeoutTimer = window.clearTimeout($this._INTERNAL.$timeoutTimer);
                }

                var pollTime = $this.$options.pollTime || 5000;
                var timeoutTime = pollTime * 0.95;

                $this._INTERNAL.$timeoutTimer = window.setTimeout($this._INTERNAL._wsTimeout.bind($this), timeoutTime);
            },
            _wsTimeout: function () {
                var $this = this;

                $this.$log('Connection timed out, Attempt to reconnect...');

                $this._INTERNAL._wsConnect.call($this);
            },
            _wsConnect: function () {
                var $this = this;
                $this._INTERNAL.$wsConnecting = true;

                $this.$log('Connecting to ' + $this.$wsUrl);

                if ($this._INTERNAL.$ws !== null && typeof $this._INTERNAL.$ws !== 'undefined') {
                    try {
                        $this._INTERNAL.ws.close();
                    } catch (err) {
                    }
                }

                try {
                    $this._INTERNAL.$ws = new $this._INTERNAL.$WebSocket($this.$wsUrl);
                    $this._INTERNAL.$ws.onmessage = $this._INTERNAL._onMessage.bind($this);
                    $this._INTERNAL.$ws.onclose = $this._INTERNAL._onClose.bind($this);
                    $this._INTERNAL.$ws.onopen = $this._INTERNAL._onOpen.bind($this);
                    $this._INTERNAL.$ws.onerror = $this._INTERNAL._onError.bind($this);
                } catch (err) {
                    $this.$log('Error Connecting to ' + $this.$wsUrl + ' - ' + err);
                }

                $this._INTERNAL._startCheckWS.call($this);
                $this._INTERNAL.$wsConnecting = false;
            }
        },
        DEFAULTS: {
            pollTime: 5000,
            url: window.location.href,
            onmessage: function () {},
            onopen: function () {},
            onclose: function () {},
            onerror: function () {}
        }
    };

    $.KWebsocket = KWebsocket;
    $.KWebsocket.constructor = KWebsocket;
})(jQuery);