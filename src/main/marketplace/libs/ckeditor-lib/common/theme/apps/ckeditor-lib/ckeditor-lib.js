var CKEDITOR_PATH = '/theme/apps/ckeditor-lib/';
var CKEDITOR_TOOLBAR_PATH = CKEDITOR_PATH + 'toolbars.js';
var CKEDITOR_JS_PATH = CKEDITOR_PATH + 'ckeditor.js';
var CKEDITOR_JQUERY_ADAPTER_PATH = CKEDITOR_PATH + 'adapters/jquery.js';

function loadCKEditor(callback) {
    $.getScriptOnce(CKEDITOR_TOOLBAR_PATH, function () {
        $.getScriptOnce(CKEDITOR_JS_PATH, function () {
            $.getScriptOnce(CKEDITOR_JQUERY_ADAPTER_PATH, function () {
                if (typeof  callback === 'function') {
                    callback();
                }
            });
        });
    });
}

function initCKEditor(target, options) {
    loadCKEditor(function () {
        target.ckeditor(options);
    });
}

$(function () {
    // https://github.com/Kademi/kademi-dev/issues/1397
    CKEDITOR.timestamp = '141020161';
});