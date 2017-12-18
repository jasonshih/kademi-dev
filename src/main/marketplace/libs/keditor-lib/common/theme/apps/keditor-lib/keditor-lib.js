var KEDITOR_PATH = '/theme/apps/keditor-lib/dist/';
var KEDITOR_JS_PATH = KEDITOR_PATH + 'js/keditor-0.0.0.min.js';
var KEDITOR_COMPONENTS_JS_PATH = KEDITOR_PATH + 'js/keditor-components-0.0.0.js';
var KEDITOR_EDM_COMPONENTS_JS_PATH = KEDITOR_PATH + 'js/keditor-edm-components-0.0.0.js';
var KEDITOR_CSS_PATH = KEDITOR_PATH + 'css/keditor-0.0.0.min.css';
var KEDITOR_COMPONENTS_CSS_PATH = KEDITOR_PATH + 'css/keditor-components-0.0.0.css';
var KEDITOR_EDM_COMPONENTS_CSS_PATH = KEDITOR_PATH + 'css/keditor-edm-components-0.0.0.css';
var KEDITOR_BOOTSTRAP_SETTINGS_CSS_PATH = KEDITOR_PATH + 'css/keditor-bootstrap-settings-0.0.0.min.css';

function loadKEditor(isEdm, callback) {
    $.getStyleOnce(KEDITOR_CSS_PATH);
    
    if (isEdm === true) {
        $.getStyleOnce(KEDITOR_EDM_COMPONENTS_CSS_PATH);
        $.getStyleOnce(KEDITOR_BOOTSTRAP_SETTINGS_CSS_PATH);
    } else {
        $.getStyleOnce(KEDITOR_COMPONENTS_CSS_PATH);
        callback = isEdm;
    }
    
    $.getScriptOnce('/static/jquery-ui/1.12.1-noui/jquery-ui.min.js', function () {
        $.getScriptOnce(KEDITOR_JS_PATH, function () {
            $.getScriptOnce(isEdm === true ? KEDITOR_EDM_COMPONENTS_JS_PATH : KEDITOR_COMPONENTS_JS_PATH, function () {
                if (typeof  callback === 'function') {
                    callback();
                }
            });
        });
    });
}

(function ($, window) {
    function initMSelectImage(target, keditor, onSelectFile) {
        target.mselect({
            contentTypes: ['image'],
            pagePath: keditor.options.pagePath,
            basePath: keditor.options.basePath,
            onSelectFile: onSelectFile
        });
    };
    
    window.initMSelectImage = initMSelectImage;
    
})(jQuery, window);
