/* 
 *       Copyright FuseLMS
 */

/*
 * Global Variable Init
 */
var global = this;


/*
 * Import kademi.js, Derived from jQuery
 */
load('static:/kodejs/kademi.js');

/*
 * XMLHttpRequest Polyfill
 */
(function (exports) {
    if (exports.XMLHttpRequest) {
        return;
    }
    exports.XMLHttpRequest = Java.type('io.milton.cloud.server.repoapps.http.XMLHttpRequest');
})(this);


/*
 * FormData Polyfill
 */
(function (exports) {
    if (exports.FormData) {
        return;
    }
    exports.FormData = Java.type('io.milton.cloud.server.repoapps.http.FormData');
})(this);


/*
 * setTimeout Polyfill
 */
(function (exports) {
    if (!exports.setTimeout) {
        exports.setTimeout = function () {
            var args = [].slice.call(arguments, 2, arguments.length);
            timer.setTimeout(arguments[0], arguments[1], args);
        };
    }

    if (!exports.clearTimeout) {
        exports.clearTimeout = function (id) {
            timer.clearTimeout(id);
        };
    }
})(this);