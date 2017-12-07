var KEDITOR_PATH = '/theme/apps/keditor-lib/dist/';
var KEDITOR_JS_PATH = KEDITOR_PATH + 'js/keditor-0.0.0.min.js';
var KEDITOR_COMPONENTS_JS_PATH = KEDITOR_PATH + 'js/keditor-components-0.0.0.js';
var KEDITOR_CSS_PATH = KEDITOR_PATH + 'css/keditor-0.0.0.min.css';
var KEDITOR_COMPONENTS_CSS_PATH = KEDITOR_PATH + 'css/keditor-components-0.0.0.css';

function loadKEditor(callback) {
    $.getStyleOnce(KEDITOR_CSS_PATH);
    $.getStyleOnce(KEDITOR_COMPONENTS_CSS_PATH);
    
    $.getScriptOnce('/static/jquery-ui/1.12.1-noui/jquery-ui.min.js', function () {
        $.getScriptOnce(KEDITOR_JS_PATH, function () {
            $.getScriptOnce(KEDITOR_COMPONENTS_JS_PATH, function () {
                if (typeof  callback === 'function') {
                    callback();
                }
            });
        });
    });
}

function initMSelectImage(target, keditor, onSelectFile) {
    flog('[jquery.contentEditor] initMSelectImage', target);
    
    target.mselect({
        contentTypes: ['image'],
        pagePath: keditor.options.pagePath,
        basePath: keditor.options.basePath,
        onSelectFile: onSelectFile
    });
    
    // var mselect = target.data('mselect');
    // var modal = mselect.modal;
    //
    // var btnCrop = $('<button type="button" class="btn-crop-image" title="Crop this image"><i class="fa fa-crop"></i></button>')
    // mselect.btnUpload.after(btnCrop);
    //
    // btnCrop.on('click', function (e) {
    //
    // });
};
