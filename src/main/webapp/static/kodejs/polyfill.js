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