var CKEDITOR_BASEPATH = '/theme/apps/ckeditor-lib/';
var CKEDITOR_TOOLBAR_PATH = CKEDITOR_BASEPATH + 'toolbars.js';
var CKEDITOR_JS_PATH = CKEDITOR_BASEPATH + 'ckeditor.js';
var CKEDITOR_JQUERY_ADAPTER_PATH = CKEDITOR_BASEPATH + 'adapters/jquery.js';
var CKEDITOR_EXTRA_STYLE_PATH = CKEDITOR_BASEPATH + 'skins/bootstrapck/editor_extra.css';

var themeCssFiles = [];

function loadCKEditor(callback) {
    $.getStyleOnce(CKEDITOR_EXTRA_STYLE_PATH);
    $.getScriptOnce(CKEDITOR_TOOLBAR_PATH, function () {
        $.getScriptOnce(CKEDITOR_JS_PATH, function () {
            $.getScriptOnce(CKEDITOR_JQUERY_ADAPTER_PATH, function () {
                CKEDITOR.timestamp = '20171223';
                CKEDITOR.dtd.$removeEmpty['i'] = false;
                
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
