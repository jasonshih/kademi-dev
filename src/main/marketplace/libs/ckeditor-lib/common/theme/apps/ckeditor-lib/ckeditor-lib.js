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
                CKEDITOR.timestamp = '20180118';
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

$(function () {
    // Fix issue related to CKEditor in Bootstrap modal
    // https://stackoverflow.com/questions/22637455/how-to-use-ckeditor-in-a-bootstrap-modal
    if ($.fn.modal && $.fn.modal.Constructor) {
        $.fn.modal.Constructor.prototype.enforceFocus = function () {
            var modal_this = this
            $(document).on('focusin.modal', function (e) {
                if (modal_this.$element[0] !== e.target && !modal_this.$element.has(e.target).length
                    // add whatever conditions you need here:
                    &&
                    !$(e.target.parentNode).hasClass('cke_dialog_ui_input_select') && !$(e.target.parentNode).hasClass('cke_dialog_ui_input_text')) {
                    modal_this.$element.focus()
                }
            })
        };
    }
});
